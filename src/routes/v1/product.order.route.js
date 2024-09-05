const express = require('express');
const auth = require('../../middlewares/auth');
const { productOrderController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productOrderController.createProductOrder)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productOrderController.queryProductOrder);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productOrderController.getProductOrderById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productOrderController.updateProductOrderById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productOrderController.deleteProductOrderById);

router
  .route('/get-product-order/by-supplyer')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), productOrderController.getProductOrderBySupplyer);
module.exports = router;
