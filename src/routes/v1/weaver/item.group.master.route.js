const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const {
  weaverItemGroupMasterController,
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
 * Keep before /:id
 */
router.post(
  '/search',
  auth('weaverManufacture'),
  weaverItemGroupMasterController.searchWeaverItemGroupMaster
);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverItemGroupMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(
    auth('weaverManufacture'),
    weaverItemGroupMasterController.createWeaverItemGroupMaster
  )
  .get(
    auth('weaverManufacture'),
    weaverItemGroupMasterController.queryWeaverItemGroupMaster
  );

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(
    auth('weaverManufacture'),
    weaverItemGroupMasterController.getWeaverItemGroupMasterById
  )
  .patch(
    auth('weaverManufacture'),
    weaverItemGroupMasterController.updateWeaverItemGroupMasterById
  )
  .delete(
    auth('weaverManufacture'),
    weaverItemGroupMasterController.deleteWeaverItemGroupMasterById
  );

module.exports = router;