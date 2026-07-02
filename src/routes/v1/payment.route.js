const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

/**
 * Create Razorpay Order
 */
router.post(
  '/create-order',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.createOrder),
  paymentController.createOrder
);

/**
 * Verify Payment
 */
router.post(
  '/verify-payment',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.verifyPayment),
  paymentController.verifyPayment
);

/**
 * Payment Failed
 * Frontend calls this if Razorpay payment.failed event occurs
 */
router.post(
  '/payment-failed',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.paymentFailed),
  paymentController.paymentFailed
);

/**
 * Razorpay Webhook
 * No Authentication Required
 */
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.razorpayWebhook);

/**
 * Get All Payments (Admin)
 */
router.get('/', validate(paymentValidation.getPayments), paymentController.getPayments);

/**
 * Logged In User Payment History
 */
router.get(
  '/my-payments',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  paymentController.getMyPayments
);

/**
 * Get Payment By Id
 */
router.get(
  '/:paymentId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.getPayment),
  paymentController.getPayment
);

/**
 * Retry Payment
 */
router.post(
  '/retry/:paymentId',
  auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'channelPartner'),
  validate(paymentValidation.retryPayment),
  paymentController.retryPayment
);

/**
 * Refund Payment
 * Only Super Admin
 */
router.post(
  '/refund/:paymentId',
  auth('superadmin'),
  validate(paymentValidation.refundPayment),
  paymentController.refundPayment
);

router.get('/dashboard', auth('superadmin'), paymentController.getPaymentDashboard);

router.get(
  '/latest/:userId',
  auth('superadmin'),
  validate(paymentValidation.getLatestPayment),
  paymentController.getLatestPayment
);

router.get('/order/:orderId', auth('superadmin'), paymentController.getPaymentByOrderId);
router.get('/gateway/:paymentId', auth('superadmin'), paymentController.getPaymentByGatewayId);

module.exports = router;
