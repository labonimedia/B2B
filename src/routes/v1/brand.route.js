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
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), brandController.queryBrand);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), brandController.getBrandById)
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.updateBrandById
  )
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), brandController.deleteBrandById);
router.post(
  '/searchmanufacturelist',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  brandController.searchBrandAndOwnerDetails
);

router.post(
  '/search/brands-connected-to-wholesalers',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  brandController.getBrandsAndWholesalers
);
router
  .route('/brandlist/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), brandController.getBrandByEmail);
router
  .route('/visible/brandlist/:email/:visibility')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    brandController.getBrandByEmailAndVisibility
  );
router
  .route('/updatevisibility/:id')
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), brandController.updatevisibility);
module.exports = router;
