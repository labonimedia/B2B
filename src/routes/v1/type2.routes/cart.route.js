const express = require('express');
const auth = require('../../../middlewares/auth');
const { cartType2Controller } = require('../../../controllers');

const router = express.Router();


router.route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.createCartType2) // Create CartType2
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.queryCartType2); // Query CartType2


router.route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.getCartType2ById) // Get CartType2 by ID
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.updateCartType2ById) // Update CartType2 by ID
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cartType2Controller.deleteCartType2ById); // Delete CartType2 by ID

module.exports = router;
