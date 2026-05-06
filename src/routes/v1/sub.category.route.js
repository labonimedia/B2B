const express = require('express');
const auth = require('../../middlewares/auth');
const { subCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'channelPartner', 'retailer'),
    subCategoryController.createSubCategory
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    subCategoryController.querySubCategory
  );
router
  .route('/filter')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    subCategoryController.querySubCategory
  );
router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    subCategoryController.getSubCategoryById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    subCategoryController.updateSubCategoryById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    subCategoryController.deleteSubCategoryById
  );

router
  .route('/get-category/by-gender')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'), subCategoryController.getCategory);
module.exports = router;
