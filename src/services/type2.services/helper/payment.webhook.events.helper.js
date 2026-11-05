// const httpStatus = require('http-status');
// const { Payment } = require('../../../models');
// const ApiError = require('../../../utils/ApiError');
// const { activateSubscription } = require('./payment.helper');

// /**
//  * Calculate Subscription Expiry
//  */
// const calculateExpiryDate = (validity, validityType) => {
//   const expiry = new Date();

//   switch (validityType) {
//     case 'days':
//       expiry.setDate(expiry.getDate() + validity);
//       break;

//     case 'months':
//       expiry.setMonth(expiry.getMonth() + validity);
//       break;

//     case 'years':
//       expiry.setFullYear(expiry.getFullYear() + validity);
//       break;

//     default:
//       expiry.setDate(expiry.getDate() + validity);
//   }

//   return expiry;
// };

// /**
//  * Handle payment.captured
//  */
// const handlePaymentCaptured = async (payload) => {
//   const paymentEntity = payload.payload.payment.entity;

//   const payment = await Payment.findOne({
//     razorpayOrderId: paymentEntity.order_id,
//   });

//   if (!payment) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Idempotency
//   |--------------------------------------------------------------------------
//   */

//   if (payment.verified) {
//     return;
//   }

//   const startDate = new Date();

//   const expiryDate = calculateExpiryDate(payment.validity, payment.validityType);

//   payment.status = 'paid';

//   payment.verified = true;

//   payment.verifiedAt = new Date();

//   payment.razorpayPaymentId = paymentEntity.id;

//   payment.paymentMethod = paymentEntity.method;

//   payment.gatewayResponse = paymentEntity;

//   payment.subscriptionStartDate = startDate;

//   payment.subscriptionExpiryDate = expiryDate;

//   payment.webhookVerified = true;

//   payment.webhookPayload = payload;

//   await payment.save();

//   await activateSubscription(payment, startDate, expiryDate);
// };

// /**
//  * Handle payment.failed
//  */
// const handlePaymentFailed = async (payload) => {
//   const paymentEntity = payload.payload.payment.entity;

//   const payment = await Payment.findOne({
//     razorpayOrderId: paymentEntity.order_id,
//   });

//   if (!payment) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Already Failed?
//   |--------------------------------------------------------------------------
//   */

//   if (payment.status === 'failed') {
//     return;
//   }

//   payment.status = 'failed';

//   payment.verified = false;

//   payment.failureReason = paymentEntity.error_description || 'Payment Failed';

//   payment.failureCode = paymentEntity.error_code || '';

//   payment.gatewayResponse = paymentEntity;

//   payment.retryCount += 1;

//   payment.webhookVerified = true;

//   payment.webhookPayload = payload;

//   await payment.save();
// };
// /**
//  * Handle refund.processed
//  */
// const handleRefundProcessed = async (payload) => {
//   const refundEntity = payload.payload.refund.entity;

//   const payment = await Payment.findOne({
//     razorpayPaymentId: refundEntity.payment_id,
//   });

//   if (!payment) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Already Refunded?
//   |--------------------------------------------------------------------------
//   */

//   if (payment.status === 'refunded') {
//     return;
//   }

//   payment.refundId = refundEntity.id;

//   payment.refundStatus = refundEntity.status;

//   payment.refundAmount = refundEntity.amount / 100;

//   payment.status = 'refunded';

//   payment.gatewayResponse = refundEntity;

//   payment.webhookVerified = true;

//   payment.webhookPayload = payload;

//   await payment.save();
// };

// /*
// |--------------------------------------------------------------------------
// | Exports
// |--------------------------------------------------------------------------
// */

// module.exports = {
//   handlePaymentCaptured,
//   handlePaymentFailed,
//   handleRefundProcessed,
// };


const httpStatus = require('http-status');

const {
  Payment,
} = require('../../../models');

const ApiError = require('../../../utils/ApiError');

const {
  activateSubscription,
} = require('./payment.helper');

const {
  recordSalesDiscountUsage,
} = require('./payment.sales.helper');


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
 *
 * This function:
 * 1. Finds the payment.
 * 2. Verifies the Razorpay payment details.
 * 3. Marks payment as paid.
 * 4. Activates subscription.
 * 5. Updates salesman discount usage.
 */
const handlePaymentCaptured = async (payload) => {

  const paymentEntity = payload.payload.payment.entity;

  // Find Payment
  const payment = await Payment.findOne({
    razorpayOrderId: paymentEntity.order_id,
  });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment not found'
    );
  }

  // Validate captured amount and currency
  if (
    paymentEntity.amount !== Math.round(payment.payableAmount * 100) ||
    paymentEntity.currency !== payment.currency
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Razorpay payment amount or currency mismatch'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Already Verified - Idempotency
  |--------------------------------------------------------------------------
  */

  if (payment.verified && payment.status === 'paid') {

    // Retry accounting if a previous webhook was interrupted.
    await recordSalesDiscountUsage(payment);

    if (
      payment.subscriptionStartDate &&
      payment.subscriptionExpiryDate
    ) {
      await activateSubscription(
        payment,
        payment.subscriptionStartDate,
        payment.subscriptionExpiryDate
      );
    }

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Payment
  |--------------------------------------------------------------------------
  */

  payment.status = 'paid';
  payment.verified = true;
  payment.verifiedAt = new Date();

  payment.razorpayPaymentId = paymentEntity.id;
  payment.paymentMethod = paymentEntity.method;

  payment.gatewayResponse = paymentEntity;

  /*
  |--------------------------------------------------------------------------
  | Subscription Dates
  |--------------------------------------------------------------------------
  */

  const startDate = new Date();

  const expiryDate = calculateExpiryDate(
    payment.validity,
    payment.validityType
  );

  payment.subscriptionStartDate = startDate;
  payment.subscriptionExpiryDate = expiryDate;

  payment.webhookVerified = true;
  payment.webhookPayload = payload;

  /*
  |--------------------------------------------------------------------------
  | Payment History
  |--------------------------------------------------------------------------
  */

  payment.history.push({
    event: 'payment.webhook.captured',
    status: 'paid',
    message: 'Payment captured successfully through Razorpay webhook',
    payload: {
      razorpayPaymentId: paymentEntity.id,
      amount: paymentEntity.amount,
      currency: paymentEntity.currency,
      method: paymentEntity.method,
    },
  });

  // Save payment first
  await payment.save();

  /*
  |--------------------------------------------------------------------------
  | Activate Subscription
  |--------------------------------------------------------------------------
  */

  await activateSubscription(
    payment,
    startDate,
    expiryDate
  );

  /*
  |--------------------------------------------------------------------------
  | Record Salesman Discount Usage
  |--------------------------------------------------------------------------
  */

  await recordSalesDiscountUsage(payment);

  /*
  |--------------------------------------------------------------------------
  | Subscription History
  |--------------------------------------------------------------------------
  */

  payment.history.push({
    event: 'subscription.activated',
    status: 'paid',
    message: 'Subscription activated successfully',
    payload: {
      subscriptionId: payment.subscriptionId,
      startDate,
      expiryDate,
    },
  });

  await payment.save();
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
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment not found'
    );
  }

  // Never downgrade a successful payment
  if (payment.status === 'paid') {
    return;
  }

  if (payment.status === 'failed') {
    return;
  }

  payment.status = 'failed';
  payment.verified = false;

  payment.failureReason =
    paymentEntity.error_description || 'Payment Failed';

  payment.failureCode =
    paymentEntity.error_code || '';

  payment.gatewayResponse = paymentEntity;

  payment.retryCount += 1;

  payment.webhookVerified = true;
  payment.webhookPayload = payload;

  payment.history.push({
    event: 'payment.webhook.failed',
    status: 'failed',
    message: payment.failureReason,
    payload: {
      failureCode: payment.failureCode,
      retryCount: payment.retryCount,
      razorpayPaymentId: paymentEntity.id,
    },
  });

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
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment not found'
    );
  }

  // Avoid processing the same refund twice
  if (
    payment.refundId === refundEntity.id &&
    payment.refundStatus === 'processed'
  ) {
    return;
  }

  payment.refundId = refundEntity.id;

  payment.refundStatus = refundEntity.status;

  payment.refundAmount =
    (payment.refundAmount || 0) + refundEntity.amount / 100;

  payment.status =
    payment.refundAmount >= payment.payableAmount
      ? 'refunded'
      : 'partially_refunded';

  payment.gatewayResponse = refundEntity;

  payment.webhookVerified = true;
  payment.webhookPayload = payload;

  payment.history.push({
    event: 'refund.processed',
    status: payment.status,
    message: 'Refund processed successfully',
    payload: refundEntity,
  });

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
