const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../../middlewares/auth');

const { weaverItemLotDesignMasterController } = require('../../../controllers');

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
router.post('/search', auth('weaverManufacture'), weaverItemLotDesignMasterController.searchWeaverItemLotDesignMaster);

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('weaverManufacture'),
  upload.single('file'),
  weaverItemLotDesignMasterController.bulkUploadFile
);

/**
 * Create + Get All
 */
router
  .route('/')
  .post(auth('weaverManufacture'), weaverItemLotDesignMasterController.createWeaverItemLotDesignMaster)
  .get(auth('weaverManufacture'), weaverItemLotDesignMasterController.queryWeaverItemLotDesignMaster);

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(auth('weaverManufacture'), weaverItemLotDesignMasterController.getWeaverItemLotDesignMasterById)
  .patch(auth('weaverManufacture'), weaverItemLotDesignMasterController.updateWeaverItemLotDesignMasterById)
  .delete(auth('weaverManufacture'), weaverItemLotDesignMasterController.deleteWeaverItemLotDesignMasterById);

module.exports = router;
