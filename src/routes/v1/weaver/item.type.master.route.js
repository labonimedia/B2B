const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemTypeMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemTypeMasterController.searchWeaverItemTypeMaster);

/**
 * Bulk Upload
 */
router.post('/bulk-upload', auth('weaverManufacture'), upload.single('file'), weaverItemTypeMasterController.bulkUploadFile);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemTypeMasterController.createWeaverItemTypeMaster)
  .get(auth('weaverManufacture'), weaverItemTypeMasterController.queryWeaverItemTypeMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemTypeMasterController.getWeaverItemTypeMasterById)
  .patch(auth('weaverManufacture'), weaverItemTypeMasterController.updateWeaverItemTypeMasterById)
  .delete(auth('weaverManufacture'), weaverItemTypeMasterController.deleteWeaverItemTypeMasterById);

module.exports = router;
