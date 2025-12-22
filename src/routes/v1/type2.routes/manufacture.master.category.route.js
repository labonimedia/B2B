const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const { manufactureCategoryController } = require('../../../controllers');

// Create + List Categories
router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureCategoryController.createCategory
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureCategoryController.getCategories
  );

// Get / Update / Delete Category by ID
router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureCategoryController.getCategoryById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureCategoryController.updateCategoryById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    manufactureCategoryController.deleteCategoryById
  );

module.exports = router;
