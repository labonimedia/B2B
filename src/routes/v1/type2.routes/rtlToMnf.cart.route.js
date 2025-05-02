const express = require('express');
const auth = require('../../../middlewares/auth');
const { rtlToMnfCartController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post
  (
auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
     rtlToMnfCartController.createCartType2) // Create CartType2
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfCartController.queryCartType2); // Query CartType2  auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfCartController.getCartType2ById) // Get CartType2 by ID
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfCartController.updateCartType2ById) // Update CartType2 by ID
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfCartController.deleteCartType2ById); // Delete CartType2 by ID

router
  .route('/catr/products')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), rtlToMnfCartController.getCartByEmail);

router.route('/cart-products/po').get(rtlToMnfCartController.getCartByEmailToPlaceOrder);

router
  .route('/updatecart/:cartId/set/:setId')
  .patch
  (
auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
  rtlToMnfCartController.updateSetItem)

   router
   .route('/:cartId/set/:setId')
   .delete(
auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
 rtlToMnfCartController.deleteCartSetItem
   ); 
module.exports = router;
