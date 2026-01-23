const express = require('express');
const auth = require('../../../middlewares/auth');
const { retailerCartType2Controller } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCartType2Controller.createRetailerCartType2) // Create CartType2
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCartType2Controller.queryRetailerCartType2); // Query CartType2

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCartType2Controller.getRetailerCartType2ById) // Get CartType2 by ID
  .patch(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    retailerCartType2Controller.updateRetailerCartType2ById
  ) // Update CartType2 by ID
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    retailerCartType2Controller.deleteRetailerCartType2ById
  ); // Delete CartType2 by ID
router
  .route('/:cartId/set/:setId')
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCartType2Controller.deleteCartSetItem);
router
  .route('/place-order/products/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCartType2Controller.genratePORetailerCartType2);

router
  .route('/catr/products')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailesr'), retailerCartType2Controller.getCartByEmail);

router
  .route('/updatecart/:cartId/set/:setId')
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), retailerCartType2Controller.updateSetItem);
module.exports = router;
