const express = require('express');
const auth = require('../../middlewares/auth');
const { brandController } = require('../../controllers');
const { commonUploadMiddleware } = require('../../utils/upload');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.createBrand
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'),
    brandController.queryBrand
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'),
    brandController.getBrandById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'),
    commonUploadMiddleware([{ name: 'brandLogo', maxCount: 1 }]),
    brandController.updateBrandById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer'),
    brandController.deleteBrandById
  );

module.exports = router;
