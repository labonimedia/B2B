const express = require('express');

//const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router.post(
  '/create-order',
 // auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.createOrder),
  paymentController.createOrder
);

router.post(
  '/verify-payment',
 // auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.verifyPayment),
  paymentController.verifyPayment
);

module.exports = router;
