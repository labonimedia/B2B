const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');

/**
 * Create Razorpay Order
 */
const createOrder = catchAsync(async (req, res) => {
  const order = await paymentService.createOrder(req.body, req.user);

  res.status(httpStatus.CREATED).send(order);
});

/**
 * Verify Razorpay Payment
 */
const verifyPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.body);

  res.status(httpStatus.OK).send(payment);
});

/**
 * Get All Payments
 */
const getPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'userEmail', 'subscriptionId', 'paymentMethod']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await paymentService.queryPayments(filter, options);

  res.status(httpStatus.OK).send(result);
});

/**
 * Get Payment By Id
 */
const getPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPayment(req.params.paymentId);

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  res.status(httpStatus.OK).send(payment);
});

/**
 * Logged In User Payment History
 */
const getMyPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.getUserPayments(req.user._id);

  res.status(httpStatus.OK).send(payments);
});

/**
 * Payment Failed
 */
const paymentFailed = catchAsync(async (req, res) => {
  const payment = await paymentService.paymentFailed(req.body);

  res.status(httpStatus.OK).send(payment);
});

/**
 * Retry Payment
 */
const retryPayment = catchAsync(async (req, res) => {
  const order = await paymentService.retryPayment(req.params.paymentId);

  res.status(httpStatus.OK).send(order);
});

/**
 * Refund Payment
 */
const refundPayment = catchAsync(async (req, res) => {
  const refund = await paymentService.refundPayment(req.params.paymentId, req.body.refundAmount);

  res.status(httpStatus.OK).send(refund);
});

const razorpayWebhook = catchAsync(async (req, res) => {
  await paymentService.razorpayWebhook(req.headers, req.body);

  res.status(httpStatus.OK).send({
    success: true,
  });
});

const getPaymentDashboard = catchAsync(async (req, res) => {
  const dashboard = await paymentService.getPaymentDashboard();

  res.status(httpStatus.OK).send(dashboard);
});

const getLatestPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getLatestPayment(req.params.userId);

  res.status(httpStatus.OK).send(payment);
});
const getPaymentByOrderId = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentByOrderId(req.params.orderId);

  res.status(httpStatus.OK).send(payment);
});
const getPaymentByGatewayId = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentByGatewayId(req.params.paymentId);

  res.status(httpStatus.OK).send(payment);
});
module.exports = {
  createOrder,
  verifyPayment,
  getPayments,
  getPayment,
  getMyPayments,
  paymentFailed,
  retryPayment,
  refundPayment,
  razorpayWebhook,
  getPaymentDashboard,
  getLatestPayment,
  getPaymentByOrderId,
  getPaymentByGatewayId,
};
