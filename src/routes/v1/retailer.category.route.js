const express = require('express');
const auth = require('../../middlewares/auth');
const { retailerCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCategoryController.createDiscountCategory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCategoryController.queryDiscountCategory);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCategoryController.getDiscountCategoryById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCategoryController.updateDiscountCategoryById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCategoryController.deleteDiscountCategoryById);

module.exports = router;
