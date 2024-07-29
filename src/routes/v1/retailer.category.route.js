const express = require('express');
const auth = require('../../middlewares/auth');
const { retailerCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), retailerCategoryController.createDiscountCategory)
  .get(auth('superadmin', 'manufacture'), retailerCategoryController.queryDiscountCategory);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), retailerCategoryController.getDiscountCategoryById)
  .patch(auth('superadmin', 'manufacture'), retailerCategoryController.updateDiscountCategoryById)
  .delete(auth('superadmin', 'manufacture'), retailerCategoryController.deleteDiscountCategoryById);

module.exports = router;
