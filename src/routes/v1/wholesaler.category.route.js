const express = require('express');
const auth = require('../../middlewares/auth');
const { wholesalerCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), wholesalerCategoryController.createDiscountCategory)
  .get(auth('superadmin', 'manufacture'), wholesalerCategoryController.queryDiscountCategory);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), wholesalerCategoryController.getDiscountCategoryById)
  .patch(auth('superadmin', 'manufacture'), wholesalerCategoryController.updateDiscountCategoryById)
  .delete(auth('superadmin', 'manufacture'), wholesalerCategoryController.deleteDiscountCategoryById);

module.exports = router;
