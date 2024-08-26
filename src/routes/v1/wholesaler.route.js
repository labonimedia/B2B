const express = require('express');
const auth = require('../../middlewares/auth');
const { wholesalerController } = require('../../controllers');

const router = express.Router();

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

module.exports = router;
