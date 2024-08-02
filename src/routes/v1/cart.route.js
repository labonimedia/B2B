const express = require('express');
const auth = require('../../middlewares/auth');
const { cartController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.addToCart);
//   .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.queryWishlist);

//   router
//   .route('/checkout/wishlist')
//   .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.checkWishlistById)
// router
//   .route('/:id')
//   .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getWishlistById)
//   .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.updateWishlistById)
//   .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.deleteWishlistById);

router.route('/:email').get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getCartByEmail);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getCartById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.updateCartById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.deleteCartById);

  router
  .route('/cart-products/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartController.getCartByEmail)
module.exports = router;
