const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemStockTypeMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemStockTypeMasterController.searchWeaverItemStockTypeMaster);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverItemStockTypeMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemStockTypeMasterController.createWeaverItemStockTypeMaster)
  .get(auth('weaverManufacture'), weaverItemStockTypeMasterController.queryWeaverItemStockTypeMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemStockTypeMasterController.getWeaverItemStockTypeMasterById)
  .patch(auth('weaverManufacture'), weaverItemStockTypeMasterController.updateWeaverItemStockTypeMasterById)
  .delete(auth('weaverManufacture'), weaverItemStockTypeMasterController.deleteWeaverItemStockTypeMasterById);

module.exports = router;
