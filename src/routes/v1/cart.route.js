const express = require('express');
const auth = require('../../middlewares/auth');
const { cartController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.addToCart);

router
  .route('/update/cart')
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.updateCartById);
router
  .route('/delete/cart')
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.deleteCartById);
router.route('/:id').get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getCartById);

router
  .route('/cart-products/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getCartByEmail);

router
  .route('/place-order/products')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getCartByEmailToPlaceOrder);

module.exports = router;
