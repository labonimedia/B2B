const multer = require('multer');
const { PutObjectCommand, DeleteObjectCommand, S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const sharp = require('sharp');
const httpStatus = require('http-status');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('./ApiError');
const config = require('../config/config');
const CDNPath = require('../models/cdn.path.model'); // MongoDB model for CDNPath collection

ffmpeg.setFfmpegPath(ffmpegPath);

const storage = multer.memoryStorage();
const upload = multer({ storage });

let s3Client;

// Function to initialize the S3 client dynamically
const initializeS3Client = async () => {
  const cdnConfig = await CDNPath.findOne({ status: 'active' }).lean();
  console.log(cdnConfig);
  if (!cdnConfig) {
    throw new Error('No active CDN configuration found');
  }

  s3Client = new S3Client({
    region: cdnConfig.region,
    endpoint: `https://${cdnConfig.bucketName}.${cdnConfig.region}.digitaloceanspaces.com`,
    credentials: {
      accessKeyId: cdnConfig.accessKey,
      secretAccessKey: cdnConfig.secreteKey,
    },
    forcePathStyle: true,
  });

  return cdnConfig;
};

/**
 * Compress videos to a smaller size
 */
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

/**
 * Compress images to a maximum of 1 MB
 */

const compressImageStream = async (fileBuffer) => {
  let quality = 80;
  let compressedBuffer = fileBuffer;

  do {
    compressedBuffer = await sharp(compressedBuffer).jpeg({ quality }).toBuffer();

    quality -= 10;
  } while (compressedBuffer.length > 1 * 1024 * 1024 && quality > 10);

  return compressedBuffer;
};

const uploadFile = async (file) => {
  const cdnConfig = await initializeS3Client();
  console.log(`Uploading file: ${file.originalname}`);

  // Construct unique file key
  const fileKey = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: cdnConfig.bucketName,
    Key: fileKey,
    ACL: 'public-read',
  };

  // Compress Video or Image **Before** Uploading
  if (file.mimetype.startsWith('video')) {
    params.Body = await compressVideo(file.buffer);
  } else if (file.mimetype.startsWith('image')) {
    params.Body = await compressImageStream(file.buffer);
  } else {
    params.Body = file.buffer;
  }

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    return `https://${cdnConfig.bucketName}.${cdnConfig.region}.digitaloceanspaces.com/${cdnConfig.bucketName}/${fileKey}`;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

const uploadFiles = async (req, res, next) => {
  try {
    const uploadPromises = [];

    for (const field of Object.keys(req.files)) {
      for (const file of req.files[field]) {
        uploadPromises.push(
          uploadFile(file).then((url) => {
            req.body[field] = req.body[field] || [];
            req.body[field].push(url);
          })
        );
      }
    }

    await Promise.all(uploadPromises);
    next();
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to upload files', details: err.message });
  }
};

const commonUploadMiddleware = (fields) => [upload.fields(fields), uploadFiles];

const getBasePath = (fullUrl) => {
  const url = new URL(fullUrl);
  return `${url.origin}/`;
};

/**
 * Delete a file from S3 bucket
 */
const deleteFile = async (filePath) => {
  try {
    const cdnconfig = await initializeS3Client();
    const basePath = getBasePath(filePath);
    // Initialize the S3 client dynamically
    s3ClientDelete = new S3Client({
      region: cdnconfig.region,
      endpoint: basePath,
      credentials: {
        accessKeyId: cdnconfig.accessKey,
        secretAccessKey: cdnconfig.secreteKey,
      },
      forcePathStyle: true,
    });

    // Ensure the filePath starts with the CDN URL or handle if it's a relative path
    let bucketKey;
    if (filePath.startsWith(basePath)) {
      bucketKey = filePath.replace(`${basePath}/`, '');
    } else if (filePath.startsWith('/')) {
      bucketKey = filePath.slice(1);
    } else {
      throw new Error(`Invalid file path. It does not belong to the configured CDN: ${filePath}`);
    }
    const params = {
      Bucket: config.cdn.bucketName,
      Key: bucketKey,
    };

    // Send the delete command to S3
    const command = new DeleteObjectCommand(params);
    const response = await s3ClientDelete.send(command);
  } catch (err) {
    throw new Error(`File deletion failed for ${filePath}: ${err.message}`);
  }
};

const getSpaceUsage = async (bucketName) => {
  let cdn;
  try {
    cdn = await CDNPath.findOne({ status: 'active' }).lean();
  } catch (err) {
    console.log(err);
  }

  // console.log(activeCdn)
  // const cdn = await initializeS3Client();

  const s3Client = new S3Client({
    region: cdn.region,
    endpoint: `https://${cdn.region}.digitaloceanspaces.com`,
    credentials: {
      accessKeyId: cdn.accessKey,
      secretAccessKey: cdn.secreteKey,
    },
    // forcePathStyle: true,  // Uncomment if needed
  });
  let totalSize = 0;
  let continuationToken;

  try {
    do {
      const params = {
        Bucket: bucketName, // The name of the bucket
        ContinuationToken: continuationToken, // For paginated results
      };

      const command = new ListObjectsV2Command(params);
      const response = await s3Client.send(command);
      if (response.Contents) {
        totalSize += response.Contents.reduce((sum, obj) => sum + obj.Size, 0);
      }
      continuationToken = response.NextContinuationToken; // Check for more pages
    } while (continuationToken);

    // Convert the total size from bytes to GB
    const totalSizeInGB = (25).toFixed(2); // Assuming the total size is 25 GB
    const usedSizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2); // Convert bytes to GB
    const totalSizeInGBFromBytes = totalSizeInGB; // Total space in GB (keep the fixed value)

    // Calculate available size
    const availableSizeInGB = (totalSizeInGBFromBytes - usedSizeInGB).toFixed(2); // Available space in GB

    // Return the response with total size, used size, and available size
    return {
      totalSizeInGB,
      usedSizeInGB,
      availableSizeInGB,
    };

    // console.log(`Total space usage: ${totalSizeInMB} MB`);
  } catch (err) {
    // console.error('Error fetching space usage:', err);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'path not found');
    // res.status(500).send({ message: 'Error fetching space usage' });
  }
};

// fetchUsage();
module.exports = {
  uploadFiles,
  commonUploadMiddleware,
  deleteFile,
  getSpaceUsage,
};
