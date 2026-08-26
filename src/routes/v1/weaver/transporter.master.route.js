const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const {
  weaverTransporterMasterController,
} = require('../../../controllers');

const staticFolder = path.join(
  __dirname,
  '../../../'
);

const uploadsFolder = path.join(
  staticFolder,
  'uploads'
);

const router = express.Router();

const upload = multer({
  dest: uploadsFolder,
});

/**
 * Search
 *
 * IMPORTANT:
 * Keep this before /:id
 */
router.post(
  '/search',
  auth('weaverManufacture'),
  weaverTransporterMasterController.searchWeaverTransporterMaster
);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverTransporterMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(
    auth('weaverManufacture'),
    weaverTransporterMasterController.createWeaverTransporterMaster
  )
  .get(
    auth('weaverManufacture'),
    weaverTransporterMasterController.queryWeaverTransporterMaster
  );

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(
    auth('weaverManufacture'),
    weaverTransporterMasterController.getWeaverTransporterMasterById
  )
  .patch(
    auth('weaverManufacture'),
    weaverTransporterMasterController.updateWeaverTransporterMasterById
  )
  .delete(
    auth('weaverManufacture'),
    weaverTransporterMasterController.deleteWeaverTransporterMasterById
  );

module.exports = router;