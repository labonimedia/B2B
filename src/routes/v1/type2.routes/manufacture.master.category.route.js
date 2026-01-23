const express = require('express');

const router = express.Router();
const auth = require('../../../middlewares/auth');
const { manufactureCategoryController } = require('../../../controllers');

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureCategoryController.createCategory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureCategoryController.getCategories);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureCategoryController.getCategoryById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureCategoryController.updateCategoryById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureCategoryController.deleteCategoryById);

module.exports = router;
