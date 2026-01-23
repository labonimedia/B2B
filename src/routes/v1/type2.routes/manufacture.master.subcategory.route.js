const express = require('express');
const auth = require('../../../middlewares/auth');
const router = express.Router();
const { manufactureSubCategoryController } = require('../../../controllers');

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureSubCategoryController.createSubcategory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureSubCategoryController.getSubcategories);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureSubCategoryController.getSubcategoryById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), manufactureSubCategoryController.updateSubcategoryById)
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureSubCategoryController.deleteSubcategoryById
  );

module.exports = router;
