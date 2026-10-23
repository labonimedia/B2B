const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');
const { weaverCityMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverCityMasterController.searchWeaverCityMaster);

/**
 * Bulk Upload
 */
router.post('/bulk-upload', auth('weaverManufacture'), upload.single('file'), weaverCityMasterController.bulkUploadFile);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverCityMasterController.createWeaverCityMaster)
  .get(auth('weaverManufacture'), weaverCityMasterController.queryWeaverCityMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverCityMasterController.getWeaverCityMasterById)
  .patch(auth('weaverManufacture'), weaverCityMasterController.updateWeaverCityMasterById)
  .delete(auth('weaverManufacture'), weaverCityMasterController.deleteWeaverCityMasterById);

module.exports = router;
