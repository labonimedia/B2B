const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemCopsMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemCopsMasterController.searchWeaverItemCopsMaster);

/**
 * Bulk Upload
 */
router.post('/bulk-upload', auth('weaverManufacture'), upload.single('file'), weaverItemCopsMasterController.bulkUploadFile);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemCopsMasterController.createWeaverItemCopsMaster)
  .get(auth('weaverManufacture'), weaverItemCopsMasterController.queryWeaverItemCopsMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemCopsMasterController.getWeaverItemCopsMasterById)
  .patch(auth('weaverManufacture'), weaverItemCopsMasterController.updateWeaverItemCopsMasterById)
  .delete(auth('weaverManufacture'), weaverItemCopsMasterController.deleteWeaverItemCopsMasterById);

module.exports = router;
