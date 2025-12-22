const express = require('express');
const auth = require('../../../middlewares/auth');
const router = express.Router();
const { manufactureSubCategoryController } = require('../../../controllers');


// Create + List Subcategories
router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureSubCategoryController.createSubcategory
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureSubCategoryController.getSubcategories
  );
// Get / Update / Delete Subcategory by ID
router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureSubCategoryController.getSubcategoryById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureSubCategoryController.updateSubcategoryById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureSubCategoryController.deleteSubcategoryById
  );

module.exports = router;
