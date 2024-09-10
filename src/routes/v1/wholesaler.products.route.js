const express = require('express');
const auth = require('../../middlewares/auth');
const { wholesalerProductsController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.createProduct)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.queryProduct);

router
  .route('/filter-products')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.searchProducts);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.getProductById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.updateProductById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.deleteProductById);

module.exports = router;
