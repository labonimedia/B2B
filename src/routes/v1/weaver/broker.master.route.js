const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const {
  weaverBrokerMasterController,
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
  weaverBrokerMasterController.searchWeaverBrokerMaster
);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverBrokerMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(
    auth('weaverManufacture'),
    weaverBrokerMasterController.createWeaverBrokerMaster
  )
  .get(
    auth('weaverManufacture'),
    weaverBrokerMasterController.queryWeaverBrokerMaster
  );

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(
    auth('weaverManufacture'),
    weaverBrokerMasterController.getWeaverBrokerMasterById
  )
  .patch(
    auth('weaverManufacture'),
    weaverBrokerMasterController.updateWeaverBrokerMasterById
  )
  .delete(
    auth('weaverManufacture'),
    weaverBrokerMasterController.deleteWeaverBrokerMasterById
  );

module.exports = router;