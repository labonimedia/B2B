const express = require('express');
const auth = require('../../../middlewares/auth');
const { wishListType2Controller } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.checkWishListType2SchemaById)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.queryWishListType2Schema);

router
  .route('/checkout/wishlist')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.checkWishListType2SchemaById);
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.getWishListType2SchemaById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.updateWishListType2SchemaById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.deleteWishListType2SchemaById);

router
  .route('/get/wishlist/:email')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wishListType2Controller.getWishListType2SchemaByEmail);
module.exports = router;
