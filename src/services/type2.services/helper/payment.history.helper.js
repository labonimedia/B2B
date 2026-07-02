const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const { Payment } = require('../../../models');

/**
 * Get Payment By Id
 */
const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate('subscriptionId', 'planName planCode amount validity validityType')
    .populate('userId', 'fullName email role');

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  return payment;
};

/**
 * Admin Payment History
 */
const getPayments = async (filter, options) => {
  return Payment.paginate(filter, options);
};

/**
 * Logged In User Payments
 */
const getMyPayments = async (userId, options = {}) => {
  return Payment.paginate(
    {
      userId,
    },
    {
      sortBy: 'createdAt:desc',
      limit: options.limit || 10,
      page: options.page || 1,
      populate: 'subscriptionId,userId',
    }
  );
};

/**
 * Payment By Razorpay Order Id
 */
const getPaymentByOrderId = async (razorpayOrderId) => {
  return Payment.findOne({
    razorpayOrderId,
  });
};

/**
 * Payment By Razorpay Payment Id
 */
const getPaymentByPaymentId = async (razorpayPaymentId) => {
  return Payment.findOne({
    razorpayPaymentId,
  });
};

/**
 * Latest Successful Payment
 */
const getLatestSuccessfulPayment = async (userId) => {
  return Payment.findOne({
    userId,
    status: 'paid',
  }).sort({
    createdAt: -1,
  });
};

/**
 * Payment Statistics
 */
const getPaymentStats = async () => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: '$status',

        totalAmount: {
          $sum: '$payableAmount',
        },

        count: {
          $sum: 1,
        },
      },
    },
  ]);

  return stats;
};

module.exports = {
  getPaymentById,
  getPayments,
  getMyPayments,
  getPaymentByOrderId,
  getPaymentByPaymentId,
  getLatestSuccessfulPayment,
  getPaymentStats,
};
