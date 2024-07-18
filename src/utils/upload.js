const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./s3');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'b2bproject',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

const uploadMiddleware = upload.fields([
  { name: 'colourImage', maxCount: 1 },
  { name: 'productImages', maxCount: 10 },
  { name: 'productVideo', maxCount: 1 }
]);

module.exports = uploadMiddleware;
