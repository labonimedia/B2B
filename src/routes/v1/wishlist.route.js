const express = require('express');
const auth = require('../../middlewares/auth');
const { wishlistController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishlistController.createWishlist)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishlistController.queryWishlist);

  router
  .route('/checkout/wishlist')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishlistController.checkWishlistById)
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishlistController.getWishlistById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishlistController.updateWishlistById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishlistController.deleteWishlistById);

module.exports = router;
