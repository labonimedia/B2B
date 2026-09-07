const express = require('express');

const multer = require('multer');

const path = require('path');

const auth = require('../../../middlewares/auth');

const { weaverJobworkProcessMasterController } = require('../../../controllers');

const router = express.Router();

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const upload = multer({
  dest: uploadsFolder,
});

/**
 * Bulk Upload
 */
router.post(
  '/bulk-upload',
  auth('superadmin', 'manufacture', 'weaverManufacture'),
  upload.single('file'),
  weaverJobworkProcessMasterController.bulkUploadFile
);

/**
 * Search
 */
router.post(
  '/search',
  auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
  weaverJobworkProcessMasterController.searchWeaverJobworkProcessMaster
);

/**
 * Create / Get All
 */
router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverJobworkProcessMasterController.createWeaverJobworkProcessMaster
  )
  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
    weaverJobworkProcessMasterController.queryWeaverJobworkProcessMaster
  );

/**
 * Get / Update / Delete by ID
 */
router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
    weaverJobworkProcessMasterController.getWeaverJobworkProcessMasterById
  )
  .patch(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverJobworkProcessMasterController.updateWeaverJobworkProcessMasterById
  )
  .delete(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverJobworkProcessMasterController.deleteWeaverJobworkProcessMasterById
  );

module.exports = router;
