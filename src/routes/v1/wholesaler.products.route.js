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
router
  .route('/get/brands')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.getProductByWholealer);
router
  .route('/filter-wholesaler-products-brands')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.searchWholesalerProducts);
router
  .route('/multiplefilters/filter-wholesalers')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerProductsController.filterProducts);
module.exports = router;
