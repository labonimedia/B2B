const express = require('express');
const auth = require('../../middlewares/auth');
const { wholesalerController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router.route('/upload/doc/:id').post(
  auth('superadmin', 'manufacture','wholesaler',),
  commonUploadMiddleware([{ name: 'file', maxCount: 1 },{ name: 'profileImg', maxCount: 1 }]),
  wholesalerController.fileupload
);
router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.createWholesaler)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.queryWholesaler);

router
  .route('/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.getWholesalerById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.updateWholesalerById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.deleteWholesalerById);
router
  .route('/manufactureList/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.getManufactureList);

  router
  .route('/get-referred/retailer')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.getRetailerByEmail);


  router
  .route('/assigndiscount/:wholesalerId')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.assignDiscount);

  router
  .route('/getdiscount/:wholesalerId/:discountGivenBy')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerController.getDiscountByGivenBy);

module.exports = router;
