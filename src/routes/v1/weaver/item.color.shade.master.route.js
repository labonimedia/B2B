const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemColorShadeMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemColorShadeMasterController.searchWeaverItemColorShadeMaster);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverItemColorShadeMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemColorShadeMasterController.createWeaverItemColorShadeMaster)
  .get(auth('weaverManufacture'), weaverItemColorShadeMasterController.queryWeaverItemColorShadeMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemColorShadeMasterController.getWeaverItemColorShadeMasterById)
  .patch(auth('weaverManufacture'), weaverItemColorShadeMasterController.updateWeaverItemColorShadeMasterById)
  .delete(auth('weaverManufacture'), weaverItemColorShadeMasterController.deleteWeaverItemColorShadeMasterById);

module.exports = router;
