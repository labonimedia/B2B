const express = require('express');
const auth = require('../../../middlewares/auth');
const { cartType2Controller } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.createCartType2)
  .get(cartType2Controller.queryCartType2);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.getCartType2ById) // Get CartType2 by ID
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.updateCartType2ById) // Update CartType2 by ID
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.deleteCartType2ById); // Delete CartType2 by ID

router.route('/place-order/products/:id').get(cartType2Controller.genratePOCartType2); // auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),

router
  .route('/catr/products')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.getCartByEmail);

router
  .route('/updatecart/:cartId/set/:setId')
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.updateSetItem);

router
  .route('/:cartId/set/:setId')
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.deleteCartSetItem);
module.exports = router;
