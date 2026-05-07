const express = require('express');
const auth = require('../../middlewares/auth');
const { productTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    productTypeController.createProductType
  )
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    productTypeController.queryProductType
  );

router
  .route('/:id')
  .get(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    productTypeController.getProductTypeById
  )
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    productTypeController.updateProductTypeById
  )
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
    productTypeController.deleteProductTypeById
  );

module.exports = router;
