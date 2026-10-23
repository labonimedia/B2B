const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemPackingMasterController } = require('../../../controllers');

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

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
router.post('/search', auth('weaverManufacture'), weaverItemPackingMasterController.searchWeaverItemPackingMaster);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverItemPackingMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemPackingMasterController.createWeaverItemPackingMaster)
  .get(auth('weaverManufacture'), weaverItemPackingMasterController.queryWeaverItemPackingMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemPackingMasterController.getWeaverItemPackingMasterById)
  .patch(auth('weaverManufacture'), weaverItemPackingMasterController.updateWeaverItemPackingMasterById)
  .delete(auth('weaverManufacture'), weaverItemPackingMasterController.deleteWeaverItemPackingMasterById);

module.exports = router;
