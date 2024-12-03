const express = require('express');
const auth = require('../../../middlewares/auth');
const { wholesalerPriceController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post( wholesalerPriceController.createWholesalerPrice) //auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  .get(wholesalerPriceController.queryWholesalerPrice);

router
  .route('/:productId')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerPriceController.getWholesalerPriceById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerPriceController.updateWholesalerPriceById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerPriceController.deleteWholesalerPriceById);

module.exports = router;
