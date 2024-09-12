const express = require('express');
const auth = require('../../middlewares/auth');
const { issueProductsController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), issueProductsController.createIssuedProducts)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), issueProductsController.queryIssuedProducts);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), issueProductsController.getIssuedProductsById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), issueProductsController.updateIssuedProductsById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), issueProductsController.deleteIssuedProductsById);

module.exports = router;
