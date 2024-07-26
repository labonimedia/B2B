const multer = require('multer');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('./s3');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

ffmpeg.setFfmpegPath(ffmpegPath);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const compressVideo = async (fileBuffer) => {
  const inputFileName = `${uuidv4()}-input.mp4`;
  const outputFileName = `${uuidv4()}-output.mp4`;
  const inputFilePath = path.join('/tmp', inputFileName);
  const outputFilePath = path.join('/tmp', outputFileName);

  await fs.promises.writeFile(inputFilePath, fileBuffer);

  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .output(outputFilePath)
      .videoCodec('libx264')
      .size('640x?')
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  const compressedBuffer = await fs.promises.readFile(outputFilePath);

  await fs.promises.unlink(inputFilePath);
  await fs.promises.unlink(outputFilePath);

  return compressedBuffer;
};

const uploadFile = async (file) => {
  const params = {
    Bucket: 'b2b',
    Key: Date.now().toString() + '-' + file.originalname,
    Body: file.buffer,
    ACL: 'public-read',
  };

  if (file.mimetype.startsWith('video')) {
    params.Body = await compressVideo(file.buffer);
  }

  const command = new PutObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    return `https://lmscontent-cdn.blr1.digitaloceanspaces.com/b2b/${params.Key}`;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload files');
    // res.status(500).send({ error: 'Failed to upload files', details: err.message });
  }
};

const uploadFiles = async (req, res, next) => {
  const uploadPromises = [];

  Object.keys(req.files).forEach(field => {
    req.files[field].forEach(file => {
      uploadPromises.push(uploadFile(file).then(url => {
        req.body[field] = req.body[field] || [];
        req.body[field].push(url);
      }));
    });
  });

  try {
    await Promise.all(uploadPromises);
    next();
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload files');
  }
};

const commonUploadMiddleware = (fields) => [
  upload.fields(fields),
  uploadFiles
];


/**
 * Delete a file from S3 bucket
 * @param {string} filePath - The path of the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  const bucketKey = filePath.replace('https://lmscontent-cdn.blr1.digitaloceanspaces.com', '');

  const params = {
    Bucket: 'b2b',
    Key: bucketKey,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload files');// Rethrow the error after logging it
  }
};

module.exports = { commonUploadMiddleware, deleteFile };

// const multer = require('multer');
// const { PutObjectCommand } = require("@aws-sdk/client-s3");
// const s3Client = require('./s3');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const uploadFiles = async (req, res, next) => {
//   const uploadPromises = [];

//   const uploadFile = async (file) => {
//     const params = {
//       Bucket: 'b2b',
//       Key: Date.now().toString() + '-' + file.originalname,
//       Body: file.buffer,
//       ACL: 'public-read',
//     };

//     const command = new PutObjectCommand(params);
//     try {
//       const data = await s3Client.send(command);
//       console.log("Uploaded file:", data);
//       return `https://lmscontent-cdn.blr1.digitaloceanspaces.com/b2b/${params.Key}`;
//     } catch (err) {
//       console.error("Error uploading file:", err);
//       throw err;  // Rethrow the error after logging it
//     }
//   };

//   if (req.files['colourImage']) {
//     const colourImage = req.files['colourImage'][0];
//     uploadPromises.push(uploadFile(colourImage));
//   }

//   if (req.files['productImages']) {
//     req.files['productImages'].forEach((file) => {
//       uploadPromises.push(uploadFile(file));
//     });
//   }

//   if (req.files['productVideo']) {
//     const productVideo = req.files['productVideo'][0];
//     uploadPromises.push(uploadFile(productVideo));
//   }

//   try {
//     const results = await Promise.all(uploadPromises);
//     req.uploadedFiles = results;
//     next();
//   } catch (err) {
//     console.error("Error in uploadFiles middleware:", err);
//     res.status(500).send({ error: 'Failed to upload files', details: err.message });
//   }
// };

// const uploadMiddleware = [upload.fields([
//   { name: 'colourImage', maxCount: 1 },
//   { name: 'productImages', maxCount: 10 },
//   { name: 'productVideo', maxCount: 1 }
// ]), uploadFiles];

// module.exports = uploadMiddleware;
// const multer = require('multer');
// const { PutObjectCommand } = require("@aws-sdk/client-s3");
// const s3Client = require('./s3');
// const sharp = require('sharp');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const loadImagemin = async () => {
//   const imagemin = (await import('imagemin')).default;
//   const imageminGifsicle = (await import('imagemin-gifsicle')).default;
//   const imageminMozjpeg = (await import('imagemin-mozjpeg')).default;
//   const imageminPngquant = (await import('imagemin-pngquant')).default;
//   const imageminSvgo = (await import('imagemin-svgo')).default;
//   return { imagemin, imageminGifsicle, imageminMozjpeg, imageminPngquant, imageminSvgo };
// };

// const compressImage = async (buffer) => {
//   return await sharp(buffer)
//     .resize({ fit: 'inside', width: 1200, height: 1200 })
//     .toFormat('jpeg', { progressive: true, quality: 80 })
//     .toBuffer();
// };

// const compressVideo = async (buffer) => {
//   const { imagemin, imageminGifsicle, imageminMozjpeg, imageminPngquant, imageminSvgo } = await loadImagemin();
//   const files = await imagemin.buffer(buffer, {
//     plugins: [
//       imageminMozjpeg({ quality: 80 }),
//       imageminPngquant({ quality: [0.6, 0.8] }),
//       imageminGifsicle({ optimizationLevel: 3 }),
//       imageminSvgo()
//     ]
//   });
//   return files;
// };

// const uploadFile = async (file) => {
//   const params = {
//     Bucket: 'b2b',
//     Key: Date.now().toString() + '-' + file.originalname,
//     Body: file.buffer,
//     ACL: 'public-read',
//   };

//   if (file.mimetype.startsWith('image')) {
//     params.Body = await compressImage(file.buffer);
//   } else if (file.mimetype.startsWith('video')) {
//     const compressedFiles = await compressVideo(file.buffer);
//     params.Body = compressedFiles[0].data;
//   }

//   const command = new PutObjectCommand(params);
//   try {
//     const data = await s3Client.send(command);
//     console.log("Uploaded file:", data);
//     return `https://lmscontent-cdn.blr1.digitaloceanspaces.com/b2b/${params.Key}`;
//   } catch (err) {
//     console.error("Error uploading file:", err);
//     throw err;
//   }
// };

// const uploadFiles = async (req, res, next) => {
//   const uploadPromises = [];

//   if (req.files['colourImage']) {
//     const colourImage = req.files['colourImage'][0];
//     uploadPromises.push(uploadFile(colourImage));
//   }

//   if (req.files['productImages']) {
//     req.files['productImages'].forEach((file) => {
//       uploadPromises.push(uploadFile(file));
//     });
//   }

//   if (req.files['productVideo']) {
//     const productVideo = req.files['productVideo'][0];
//     uploadPromises.push(uploadFile(productVideo));
//   }

//   try {
//     const results = await Promise.all(uploadPromises);
//     req.uploadedFiles = results;
//     next();
//   } catch (err) {
//     console.error("Error in uploadFiles middleware:", err);
//     res.status(500).send({ error: 'Failed to upload files', details: err.message });
//   }
// };

// const uploadMiddleware = [upload.fields([
//   { name: 'colourImage', maxCount: 1 },
//   { name: 'productImages', maxCount: 10 },
//   { name: 'productVideo', maxCount: 1 }
// ]), uploadFiles];

// module.exports = uploadMiddleware;
