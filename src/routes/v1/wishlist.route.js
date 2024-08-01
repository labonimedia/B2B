const express = require('express');
const auth = require('../../middlewares/auth');
const { wishlistController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture'), wishlistController.createWishlist)
  .get(auth('superadmin', 'manufacture'), wishlistController.queryWishlist);

  router
  .route('/checkout/wishlist')
  .get(auth('superadmin', 'manufacture'), wishlistController.checkWishlistById)
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture'), wishlistController.getWishlistById)
  .patch(auth('superadmin', 'manufacture'), wishlistController.updateWishlistById)
  .delete(auth('superadmin', 'manufacture'), wishlistController.deleteWishlistById);

module.exports = router;
