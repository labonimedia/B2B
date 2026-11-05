// const httpStatus = require('http-status');
// const razorpay = require('../config/razorpay');
// const ApiError = require('../utils/ApiError');
// const { Payment } = require('../models');
// const { activateSubscription } = require('./type2.services/helper/payment.helper');
// const { verifySignature } = require('./type2.services/helper/payment.validation.helper');
// const { createRazorpayOrder } = require('./type2.services/helper/payment.order.helper');
// const { processWebhook } = require('./type2.services/helper/payment.webhook.helper');
// const { processRefund } = require('./type2.services/helper/payment.refund.helper');
// const { addPaymentHistory } = require('./type2.services/helper/payment.audit.helper');
// const { recordSalesDiscountUsage } = require('./type2.services/helper/payment.sales.helper');

// const {
//   getPaymentById: getPaymentByIdHelper,
//   getPayments: getPaymentsHelper,
//   getMyPayments: getMyPaymentsHelper,
//   getPaymentByOrderId: getPaymentByOrderIdHelper,
//   getPaymentByPaymentId: getPaymentByPaymentIdHelper,
//   getLatestSuccessfulPayment: getLatestSuccessfulPaymentHelper,
//   getPaymentStats: getPaymentStatsHelper,
// } = require('./type2.services/helper/payment.history.helper');

// /**
//  * Calculate Expiry Date
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

// const createOrder = async (body, loggedInUser) => {
//   return createRazorpayOrder(body, loggedInUser);
// };

// const verifyPayment = async (body) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

//   // Verify Razorpay Signature
//   verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

//   // Find Payment
//   const payment = await Payment.findOne({
//     razorpayOrderId: razorpay_order_id,
//   });

//   if (!payment) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Payment record not found');
//   }

//   // Already Verified
//   if (payment.verified && payment.status === 'paid') {
//     return {
//       success: true,
//       message: 'Payment already verified',
//       payment,
//     };
//   }

//   // Fetch Payment From Razorpay
//   const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

//   // Payment Failed
//   if (razorpayPayment.status !== 'captured' && razorpayPayment.status !== 'authorized') {
//     payment.status = 'failed';
//     payment.failureReason = razorpayPayment.status;
//     payment.gatewayResponse = razorpayPayment;

//     addPaymentHistory(payment, 'payment.verification.failed', 'failed', 'Payment verification failed', {
//       razorpayPaymentId: razorpay_payment_id,
//       razorpayStatus: razorpayPayment.status,
//     });

//     await payment.save();

//     throw new ApiError(httpStatus.BAD_REQUEST, 'Payment not successful');
//   }

//   // Update Payment
//   payment.status = 'paid';
//   payment.verified = true;
//   payment.verifiedAt = new Date();
//   payment.razorpayPaymentId = razorpay_payment_id;
//   payment.razorpaySignature = razorpay_signature;
//   payment.paymentMethod = razorpayPayment.method;
//   payment.gatewayResponse = razorpayPayment;

//   // Subscription Dates
//   const startDate = new Date();
//   const expiryDate = calculateExpiryDate(payment.validity, payment.validityType);

//   payment.subscriptionStartDate = startDate;
//   payment.subscriptionExpiryDate = expiryDate;

//   // History - Payment Verified
//   addPaymentHistory(payment, 'payment.verified', 'paid', 'Payment verified successfully', {
//     razorpayPaymentId: razorpay_payment_id,
//     paymentMethod: razorpayPayment.method,
//     amount: payment.payableAmount,
//     currency: payment.currency,
//   });

//   // Activate Subscription
//   await activateSubscription(payment, startDate, expiryDate);

//   // History - Subscription Activated
//   addPaymentHistory(payment, 'subscription.activated', 'paid', 'Subscription activated successfully', {
//     subscriptionId: payment.subscriptionId,
//     startDate,
//     expiryDate,
//   });

//   await payment.save();

//   return {
//     success: true,
//     message: 'Payment verified successfully',
//     payment,
//   };
// };
// /**
//  * Get All Payments
//  * @param {Object} filter
//  * @param {Object} options
//  * @returns {Promise<QueryResult>}
//  */
// const queryPayments = async (filter, options) => {
//   filter.isDeleted = false;
//   options.sortBy = options.sortBy || 'createdAt:desc';

//   return getPaymentsHelper(filter, options);
// };

// /**
//  * Get Payment By Id
//  * @param {ObjectId} paymentId
//  * @returns {Promise<Payment>}
//  */
// const getPayment = async (paymentId) => {
//   return getPaymentByIdHelper(paymentId);
// };

// /**
//  * Logged In User Payment History
//  * @param {ObjectId} userId
//  * @returns {Promise<Array>}
//  */
// const getUserPayments = async (userId, options) => {
//   return getMyPaymentsHelper(userId, options);
// };

// const paymentFailed = async (body) => {
//   const { razorpayOrderId, failureReason, failureCode, gatewayResponse } = body;

//   /*
//   |--------------------------------------------------------------------------
//   | Find Payment
//   |--------------------------------------------------------------------------
//   */

//   const payment = await Payment.findOne({
//     razorpayOrderId,
//   });

//   if (!payment) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Update Payment
//   |--------------------------------------------------------------------------
//   */

//   payment.status = 'failed';
//   payment.failureReason = failureReason;
//   payment.failureCode = failureCode;
//   payment.gatewayResponse = gatewayResponse;
//   payment.retryCount += 1;

//   /*
//   |--------------------------------------------------------------------------
//   | Payment History
//   |--------------------------------------------------------------------------
//   */

//   addPaymentHistory(payment, 'payment.failed', 'failed', failureReason, {
//     failureCode,
//     gatewayResponse,
//     retryCount: payment.retryCount,
//   });

//   await payment.save();

//   return payment;
// };

// /**
//  * Retry Payment
//  * Creates a new Razorpay Order
//  */
// const retryPayment = async (paymentId) => {
//   /*
//   |--------------------------------------------------------------------------
//   | Find Payment
//   |--------------------------------------------------------------------------
//   */

//   const payment = await Payment.findById(paymentId);

//   if (!payment) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Validate Retry
//   |--------------------------------------------------------------------------
//   */

//   if (['paid', 'refunded', 'partially_refunded'].includes(payment.status)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Retry not allowed for this payment');
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Create Razorpay Order
//   |--------------------------------------------------------------------------
//   */

//   const receipt = `RETRY_${Date.now()}`;

//   const razorpayOrder = await razorpay.orders.create({
//     amount: payment.payableAmount * 100,
//     currency: payment.currency,
//     receipt,
//   });

//   /*
//   |--------------------------------------------------------------------------
//   | Update Payment
//   |--------------------------------------------------------------------------
//   */

//   payment.razorpayOrderId = razorpayOrder.id;
//   payment.receipt = receipt;
//   payment.status = 'created';

//   /*
//   |--------------------------------------------------------------------------
//   | Payment History
//   |--------------------------------------------------------------------------
//   */

//   addPaymentHistory(payment, 'payment.retry', 'created', 'Retry payment initiated', {
//     razorpayOrderId: razorpayOrder.id,
//     receipt,
//     amount: payment.payableAmount,
//     currency: payment.currency,
//   });

//   await payment.save();

//   return {
//     paymentId: payment._id,
//     razorpayOrderId: razorpayOrder.id,
//     amount: payment.payableAmount,
//     currency: payment.currency,
//     receipt,
//   };
// };
// /**
//  * Refund Payment
//  * (Future Ready)
//  */
// const refundPayment = async (paymentId, refundAmount) => {
//   return processRefund(paymentId, refundAmount);
// };

// const razorpayWebhook = async (headers, body) => {
//   return processWebhook(headers, body);
// };
// const getPaymentDashboard = async () => {
//   return getPaymentStatsHelper();
// };
// const getLatestPayment = async (userId) => {
//   return getLatestSuccessfulPaymentHelper(userId);
// };
// const getPaymentByOrderId = async (orderId) => {
//   return getPaymentByOrderIdHelper(orderId);
// };
// const getPaymentByGatewayId = async (paymentId) => {
//   return getPaymentByPaymentIdHelper(paymentId);
// };

// module.exports = {
//   createOrder,
//   verifyPayment,
//   queryPayments,
//   getPayment,
//   getUserPayments,
//   paymentFailed,
//   retryPayment,
//   refundPayment,
//   razorpayWebhook,
//   getPaymentDashboard,
//   getLatestPayment,
//   getPaymentByOrderId,
//   getPaymentByGatewayId,
// };


const httpStatus = require('http-status');
const razorpay = require('../config/razorpay');
const ApiError = require('../utils/ApiError');

const { Payment } = require('../models');

const {
  activateSubscription,
} = require('./type2.services/helper/payment.helper');

const {
  verifySignature,
} = require('./type2.services/helper/payment.validation.helper');

const {
  createRazorpayOrder,
} = require('./type2.services/helper/payment.order.helper');

const {
  processWebhook,
} = require('./type2.services/helper/payment.webhook.helper');

const {
  processRefund,
} = require('./type2.services/helper/payment.refund.helper');

const {
  addPaymentHistory,
} = require('./type2.services/helper/payment.audit.helper');

// Salesman discount tracking
const {
  recordSalesDiscountUsage,
} = require('./type2.services/helper/payment.sales.helper');

const {
  getPaymentById: getPaymentByIdHelper,
  getPayments: getPaymentsHelper,
  getMyPayments: getMyPaymentsHelper,
  getPaymentByOrderId: getPaymentByOrderIdHelper,
  getPaymentByPaymentId: getPaymentByPaymentIdHelper,
  getLatestSuccessfulPayment: getLatestSuccessfulPaymentHelper,
  getPaymentStats: getPaymentStatsHelper,
} = require('./type2.services/helper/payment.history.helper');


/**
 * Calculate Expiry Date
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
 * Create Razorpay Order
 */
const createOrder = async (body, loggedInUser) => {
  return createRazorpayOrder(body, loggedInUser);
};


/**
 * Verify Razorpay Payment
 */
const verifyPayment = async (body) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  /*
  |--------------------------------------------------------------------------
  | 1. Verify Razorpay Signature
  |--------------------------------------------------------------------------
  */

  verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  /*
  |--------------------------------------------------------------------------
  | 2. Find Payment
  |--------------------------------------------------------------------------
  */

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment record not found'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | 3. Already Verified - Idempotency
  |--------------------------------------------------------------------------
  */

  if (payment.verified && payment.status === 'paid') {

    // Retry discount tracking if a previous request was interrupted.
    await recordSalesDiscountUsage(payment);

    // Reapply the same subscription dates safely.
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

    return {
      success: true,
      message: 'Payment already verified',
      payment,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | 4. Fetch Payment From Razorpay
  |--------------------------------------------------------------------------
  */

  const razorpayPayment = await razorpay.payments.fetch(
    razorpay_payment_id
  );

  /*
  |--------------------------------------------------------------------------
  | 5. Validate Payment Status
  |--------------------------------------------------------------------------
  */

  if (
    razorpayPayment.order_id !== razorpay_order_id ||
    !['captured', 'authorized'].includes(razorpayPayment.status)
  ) {
    payment.status = 'failed';

    payment.failureReason =
      razorpayPayment.status || 'Payment verification failed';

    payment.gatewayResponse = razorpayPayment;

    addPaymentHistory(
      payment,
      'payment.verification.failed',
      'failed',
      'Payment verification failed',
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpayStatus: razorpayPayment.status,
      }
    );

    await payment.save();

    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Payment not successful'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | 6. Update Payment
  |--------------------------------------------------------------------------
  */

  payment.status = 'paid';
  payment.verified = true;
  payment.verifiedAt = new Date();

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;

  payment.paymentMethod = razorpayPayment.method;
  payment.gatewayResponse = razorpayPayment;

  /*
  |--------------------------------------------------------------------------
  | 7. Calculate Subscription Dates
  |--------------------------------------------------------------------------
  */

  const startDate = new Date();

  const expiryDate = calculateExpiryDate(
    payment.validity,
    payment.validityType
  );

  payment.subscriptionStartDate = startDate;
  payment.subscriptionExpiryDate = expiryDate;

  /*
  |--------------------------------------------------------------------------
  | 8. Payment Verification History
  |--------------------------------------------------------------------------
  */

  addPaymentHistory(
    payment,
    'payment.verified',
    'paid',
    'Payment verified successfully',
    {
      razorpayPaymentId: razorpay_payment_id,
      paymentMethod: razorpayPayment.method,
      amount: payment.payableAmount,
      currency: payment.currency,
      salesRegistrationId: payment.salesRegistrationId || null,
      salesmanId: payment.salesmanId || null,
      discountAmount: payment.discountAmount || 0,
    }
  );

  /*
  |--------------------------------------------------------------------------
  | 9. Save Payment First
  |--------------------------------------------------------------------------
  */

  await payment.save();

  /*
  |--------------------------------------------------------------------------
  | 10. Activate Subscription
  |--------------------------------------------------------------------------
  */

  await activateSubscription(
    payment,
    startDate,
    expiryDate
  );

  /*
  |--------------------------------------------------------------------------
  | 11. Record Salesman Discount Usage
  |--------------------------------------------------------------------------
  */

  await recordSalesDiscountUsage(payment);

  /*
  |--------------------------------------------------------------------------
  | 12. Subscription Activation History
  |--------------------------------------------------------------------------
  */

  addPaymentHistory(
    payment,
    'subscription.activated',
    'paid',
    'Subscription activated successfully',
    {
      subscriptionId: payment.subscriptionId,
      startDate,
      expiryDate,
    }
  );

  await payment.save();

  /*
  |--------------------------------------------------------------------------
  | 13. Response
  |--------------------------------------------------------------------------
  */

  return {
    success: true,
    message: 'Payment verified successfully',
    payment,
  };
};


/**
 * Get All Payments
 */
const queryPayments = async (filter, options) => {
  filter.isDeleted = false;

  options.sortBy = options.sortBy || 'createdAt:desc';

  return getPaymentsHelper(filter, options);
};


/**
 * Get Payment By Id
 */
const getPayment = async (paymentId) => {
  return getPaymentByIdHelper(paymentId);
};


/**
 * Logged In User Payment History
 */
const getUserPayments = async (userId, options) => {
  return getMyPaymentsHelper(userId, options);
};


/**
 * Payment Failed
 */
const paymentFailed = async (body) => {
  const {
    razorpayOrderId,
    failureReason,
    failureCode,
    gatewayResponse,
  } = body;

  const payment = await Payment.findOne({
    razorpayOrderId,
  });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment not found'
    );
  }

  // Never downgrade an already successful payment.
  if (payment.status === 'paid') {
    return payment;
  }

  payment.status = 'failed';
  payment.failureReason = failureReason;
  payment.failureCode = failureCode;
  payment.gatewayResponse = gatewayResponse;
  payment.retryCount += 1;

  addPaymentHistory(
    payment,
    'payment.failed',
    'failed',
    failureReason,
    {
      failureCode,
      gatewayResponse,
      retryCount: payment.retryCount,
    }
  );

  await payment.save();

  return payment;
};


/**
 * Retry Payment
 */
const retryPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Payment not found'
    );
  }

  if (
    ['paid', 'refunded', 'partially_refunded'].includes(payment.status)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Retry not allowed for this payment'
    );
  }

  const receipt = `RETRY_${Date.now()}`;

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(payment.payableAmount * 100),
    currency: payment.currency,
    receipt,
  });

  payment.razorpayOrderId = razorpayOrder.id;
  payment.receipt = receipt;
  payment.status = 'created';

  // Reset verification details for the new order.
  payment.verified = false;
  payment.verifiedAt = null;
  payment.razorpayPaymentId = null;
  payment.razorpaySignature = null;

  addPaymentHistory(
    payment,
    'payment.retry',
    'created',
    'Retry payment initiated',
    {
      razorpayOrderId: razorpayOrder.id,
      receipt,
      amount: payment.payableAmount,
      currency: payment.currency,
    }
  );

  await payment.save();

  return {
    paymentId: payment._id,
    razorpayOrderId: razorpayOrder.id,
    amount: payment.payableAmount,
    currency: payment.currency,
    receipt,
  };
};


/**
 * Refund Payment
 */
const refundPayment = async (paymentId, refundAmount) => {
  return processRefund(paymentId, refundAmount);
};


/**
 * Razorpay Webhook
 */
const razorpayWebhook = async (headers, body) => {
  return processWebhook(headers, body);
};


/**
 * Payment Dashboard
 */
const getPaymentDashboard = async () => {
  return getPaymentStatsHelper();
};


/**
 * Latest Successful Payment
 */
const getLatestPayment = async (userId) => {
  return getLatestSuccessfulPaymentHelper(userId);
};


/**
 * Payment By Order ID
 */
const getPaymentByOrderId = async (orderId) => {
  return getPaymentByOrderIdHelper(orderId);
};


/**
 * Payment By Gateway Payment ID
 */
const getPaymentByGatewayId = async (paymentId) => {
  return getPaymentByPaymentIdHelper(paymentId);
};


module.exports = {
  createOrder,
  verifyPayment,
  queryPayments,
  getPayment,
  getUserPayments,
  paymentFailed,
  retryPayment,
  refundPayment,
  razorpayWebhook,
  getPaymentDashboard,
  getLatestPayment,
  getPaymentByOrderId,
  getPaymentByGatewayId,
};
