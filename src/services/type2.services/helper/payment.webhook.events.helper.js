const httpStatus = require('http-status');
const { Payment } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const { activateSubscription } = require('./payment.helper');

/**
 * Calculate Subscription Expiry
 */
const calculateExpiryDate = (validity, validityType) => {
  const expiry = new Date();

  switch (validityType) {
    case 'days':
      expiry.setDate(expiry.getDate() + validity);
      break;

    case 'months':
      expiry.setMonth(expiry.getMonth() + validity);
      break;

    case 'years':
      expiry.setFullYear(expiry.getFullYear() + validity);
      break;

    default:
      expiry.setDate(expiry.getDate() + validity);
  }

  return expiry;
};

/**
 * Handle payment.captured
 */
const handlePaymentCaptured = async (payload) => {
  const paymentEntity = payload.payload.payment.entity;

  const payment = await Payment.findOne({
    razorpayOrderId: paymentEntity.order_id,
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  /*
  |--------------------------------------------------------------------------
  | Idempotency
  |--------------------------------------------------------------------------
  */

  if (payment.verified) {
    return;
  }

  const startDate = new Date();

  const expiryDate = calculateExpiryDate(payment.validity, payment.validityType);

  payment.status = 'paid';

  payment.verified = true;

  payment.verifiedAt = new Date();

  payment.razorpayPaymentId = paymentEntity.id;

  payment.paymentMethod = paymentEntity.method;

  payment.gatewayResponse = paymentEntity;

  payment.subscriptionStartDate = startDate;

  payment.subscriptionExpiryDate = expiryDate;

  payment.webhookVerified = true;

  payment.webhookPayload = payload;

  await payment.save();

  await activateSubscription(payment, startDate, expiryDate);
};

/**
 * Handle payment.failed
 */
const handlePaymentFailed = async (payload) => {
  const paymentEntity = payload.payload.payment.entity;

  const payment = await Payment.findOne({
    razorpayOrderId: paymentEntity.order_id,
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  /*
  |--------------------------------------------------------------------------
  | Already Failed?
  |--------------------------------------------------------------------------
  */

  if (payment.status === 'failed') {
    return;
  }

  payment.status = 'failed';

  payment.verified = false;

  payment.failureReason = paymentEntity.error_description || 'Payment Failed';

  payment.failureCode = paymentEntity.error_code || '';

  payment.gatewayResponse = paymentEntity;

  payment.retryCount += 1;

  payment.webhookVerified = true;

  payment.webhookPayload = payload;

  await payment.save();
};
/**
 * Handle refund.processed
 */
const handleRefundProcessed = async (payload) => {
  const refundEntity = payload.payload.refund.entity;

  const payment = await Payment.findOne({
    razorpayPaymentId: refundEntity.payment_id,
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  /*
  |--------------------------------------------------------------------------
  | Already Refunded?
  |--------------------------------------------------------------------------
  */

  if (payment.status === 'refunded') {
    return;
  }

  payment.refundId = refundEntity.id;

  payment.refundStatus = refundEntity.status;

  payment.refundAmount = refundEntity.amount / 100;

  payment.status = 'refunded';

  payment.gatewayResponse = refundEntity;

  payment.webhookVerified = true;

  payment.webhookPayload = payload;

  await payment.save();
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  handlePaymentCaptured,
  handlePaymentFailed,
  handleRefundProcessed,
};
