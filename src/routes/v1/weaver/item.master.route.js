const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemMasterController.searchWeaverItemMaster);

/**
 * Bulk Upload
 */
router.post('/bulk-upload', auth('weaverManufacture'), upload.single('file'), weaverItemMasterController.bulkUploadFile);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemMasterController.createWeaverItemMaster)
  .get(auth('weaverManufacture'), weaverItemMasterController.queryWeaverItemMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemMasterController.getWeaverItemMasterById)
  .patch(auth('weaverManufacture'), weaverItemMasterController.updateWeaverItemMasterById)
  .delete(auth('weaverManufacture'), weaverItemMasterController.deleteWeaverItemMasterById);

module.exports = router;
