const express = require('express');
const auth = require('../../middlewares/auth');
const { subCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.createSubCategory)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.querySubCategory);
  router
  .route('/filter')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.querySubCategory);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.getSubCategoryById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.updateSubCategoryById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.deleteSubCategoryById);

router
  .route('/get-category/by-gender')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), subCategoryController.getCategory);
module.exports = router;
