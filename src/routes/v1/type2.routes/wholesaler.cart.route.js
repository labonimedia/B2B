// const express = require('express');
// const auth = require('../../../middlewares/auth');
// const { wholesalerCartToManufacturerController } = require('../../../controllers');

// const router = express.Router();

// router
//   .route('/')
//   .post(auth('wholesaler'), wholesalerCartToManufacturerController.addToCart)
//   .get(auth('wholesaler'), wholesalerCartToManufacturerController.getCartByWholesaler);

// router
//   .route('/:id')
//   .get(auth('wholesaler'), wholesalerCartToManufacturerController.getSingleCart)
//   .patch(auth('wholesaler'), wholesalerCartToManufacturerController.updateCart)
//   .delete(auth('wholesaler'), wholesalerCartToManufacturerController.deleteCart);

// router.patch('/update-item/:cartId', auth('wholesaler'), wholesalerCartToManufacturerController.updateCartSetItem);

// module.exports = router;

const express = require('express');
const auth = require('../../../middlewares/auth');
const { wholesalerCartToManufacturerController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.createCart)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.queryCart);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.getCartById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.updateCartById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.deleteCartById);

router
  .route('/cart/products')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.getCartByEmail);

router.route('/cart-products/po').get(wholesalerCartToManufacturerController.getCartByEmailToPlaceOrder);

router
  .route('/updatecart/:cartId/set/:setId')
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.updateSetItem);

router
  .route('/:cartId/set/:setId')
  .delete(auth('superadmin', 'manufacture', 'wholesaler'), wholesalerCartToManufacturerController.deleteCartSetItem);

module.exports = router;
