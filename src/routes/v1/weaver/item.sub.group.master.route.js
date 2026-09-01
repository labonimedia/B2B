const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemSubGroupMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemSubGroupMasterController.searchWeaverItemSubGroupMaster);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverItemSubGroupMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemSubGroupMasterController.createWeaverItemSubGroupMaster)
  .get(auth('weaverManufacture'), weaverItemSubGroupMasterController.queryWeaverItemSubGroupMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemSubGroupMasterController.getWeaverItemSubGroupMasterById)
  .patch(auth('weaverManufacture'), weaverItemSubGroupMasterController.updateWeaverItemSubGroupMasterById)
  .delete(auth('weaverManufacture'), weaverItemSubGroupMasterController.deleteWeaverItemSubGroupMasterById);

module.exports = router;
