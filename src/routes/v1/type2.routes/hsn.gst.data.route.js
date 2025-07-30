const express = require('express');
const multer = require('multer');
const path = require('path');
const { gstHsnController } = require('../../../controllers');

const staticFolder = path.join(__dirname, '../../');
const uploadsFolder = path.join(staticFolder, 'uploads');

const router = express.Router();

const upload = multer({ dest: uploadsFolder });

router
  .route('/')
  .get(
    gstHsnController.getHsnCodes
  );
router
  .route('/bulkupload')
  .post(  
    upload.single('file'),
    gstHsnController.bulkUploadFile
  );
router
  .route('/:hsnCode')
  .get(
    gstHsnController.getHsnCodeDetails
  );

module.exports = router;
