const express = require('express');

const multer = require('multer');

const path = require('path');

const auth = require('../../../middlewares/auth');

const { weaverCashBankBookMasterController } = require('../../../controllers');

const router = express.Router();

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const upload = multer({
  dest: uploadsFolder,
});

router.post(
  '/bulk-upload',
  auth('superadmin', 'manufacture', 'weaverManufacture'),
  upload.single('file'),
  weaverCashBankBookMasterController.bulkUploadFile
);

router.post(
  '/search',
  auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
  weaverCashBankBookMasterController.searchWeaverCashBankBookMaster
);

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverCashBankBookMasterController.createWeaverCashBankBookMaster
  )
  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
    weaverCashBankBookMasterController.queryWeaverCashBankBookMaster
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
    weaverCashBankBookMasterController.getWeaverCashBankBookMasterById
  )
  .patch(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverCashBankBookMasterController.updateWeaverCashBankBookMasterById
  )
  .delete(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverCashBankBookMasterController.deleteWeaverCashBankBookMasterById
  );

module.exports = router;
