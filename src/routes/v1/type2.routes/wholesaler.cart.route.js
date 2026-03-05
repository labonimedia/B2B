const express = require('express');
const auth = require('../../../middlewares/auth');
const { wholesalerCartToManufacturerController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('wholesaler'), wholesalerCartToManufacturerController.addToCart)
  .get(auth('wholesaler'), wholesalerCartToManufacturerController.getCartByWholesaler);

router
  .route('/:id')
  .get(auth('wholesaler'), wholesalerCartToManufacturerController.getSingleCart)
  .patch(auth('wholesaler'), wholesalerCartToManufacturerController.updateCart)
  .delete(auth('wholesaler'), wholesalerCartToManufacturerController.deleteCart);

router.patch('/update-item/:cartId', auth('wholesaler'), wholesalerCartToManufacturerController.updateCartSetItem);

module.exports = router;
