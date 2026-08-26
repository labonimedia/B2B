const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const {
  weaverAcountMasterController,
} = require('../../../controllers');

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(
  staticFolder,
  'uploads'
);

const upload = multer({
  dest: uploadsFolder,
});
const router = express.Router();

router.post(
  '/search',
  weaverAcountMasterController.searchWeaverAcountMaster
);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverAcountMasterController.bulkUploadFile
);

router
  .route('/')
  .post(
    weaverAcountMasterController.createWeaverAcountMaster
  )
  .get(
    weaverAcountMasterController.queryWeaverAcountMaster
  );

router
  .route('/:id')
  .get(
    weaverAcountMasterController.getWeaverAcountMasterById
  )
  .patch(
    weaverAcountMasterController.updateWeaverAcountMasterById
  )
  .delete(
    weaverAcountMasterController.deleteWeaverAcountMasterById
  );

module.exports = router;