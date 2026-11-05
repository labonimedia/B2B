const express = require('express');
const auth = require('../../middlewares/auth');
const { brandController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router
  .route('/')
  .post(
    // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.createBrand
  )
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), brandController.queryBrand);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), brandController.getBrandById)
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.updateBrandById
  )
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), brandController.deleteBrandById);
router.post(
  '/searchmanufacturelist',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
  brandController.searchBrandAndOwnerDetails
);

router.post(
  '/search/brands-connected-to-wholesalers',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
  brandController.getBrandsAndWholesalers
);
router
  .route('/brandlist/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), brandController.getBrandByEmail);
router
  .route('/visible/brandlist/:email/:visibility')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'),
    brandController.getBrandByEmailAndVisibility
  );
router
  .route('/updatevisibility/:id')
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner', 'weaverManufacture'), brandController.updatevisibility);
module.exports = router;
