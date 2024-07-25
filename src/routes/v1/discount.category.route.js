const express = require('express');
const auth = require('../../middlewares/auth');
const { discountCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), discountCategoryController.createDiscountCategory)
  .get(auth('superadmin', 'manufacture'), discountCategoryController.queryDiscountCategory);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), discountCategoryController.getDiscountCategoryById)
  .patch(auth('superadmin', 'manufacture'), discountCategoryController.updateDiscountCategoryById)
  .delete(auth('superadmin', 'manufacture'), discountCategoryController.deleteDiscountCategoryById);

module.exports = router;
