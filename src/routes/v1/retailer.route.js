const express = require('express');
const auth = require('../../middlewares/auth');
const { retailerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.createRetailer)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.queryRetailer);

router
  .route('/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.getRetailerById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.updateRetailerById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerController.deleteRetailerById);

module.exports = router;
