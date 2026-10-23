const express = require('express');

const multer = require('multer');
const path = require('path');

const auth = require('../../../middlewares/auth');

const { weaverSalesPurchaseBookMasterController } = require('../../../controllers');

const router = express.Router();

const staticFolder = path.join(__dirname, '../../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const upload = multer({
  dest: uploadsFolder,
});

router.post(
  '/bulk-upload',
 auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
  upload.single('file'),
  weaverSalesPurchaseBookMasterController.bulkUploadFile
);

router.post(
  '/search',
  auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
  weaverSalesPurchaseBookMasterController.searchWeaverSalesPurchaseBookMaster
);

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
   weaverSalesPurchaseBookMasterController.createWeaverSalesPurchaseBookMaster)
  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
    weaverSalesPurchaseBookMasterController.queryWeaverSalesPurchaseBookMaster
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'weaverManufacture', 'wholesaler', 'retailer'),
    weaverSalesPurchaseBookMasterController.getWeaverSalesPurchaseBookMasterById
  )
  .patch(auth('superadmin', 'manufacture', 'weaverManufacture'), weaverSalesPurchaseBookMasterController.updateWeaverSalesPurchaseBookMasterById)
  .delete(
    auth('superadmin', 'manufacture', 'weaverManufacture'),
    weaverSalesPurchaseBookMasterController.deleteWeaverSalesPurchaseBookMasterById
  );

module.exports = router;
