const express = require('express');
const auth = require('../../middlewares/auth');
const { includeComponentController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), includeComponentController.createIncludeComponent)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), includeComponentController.queryIncludeComponent);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), includeComponentController.getIncludeComponentById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), includeComponentController.updateIncludeComponentById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), includeComponentController.deleteIncludeComponentById);

module.exports = router;
