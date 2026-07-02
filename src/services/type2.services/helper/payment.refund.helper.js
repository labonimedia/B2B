const httpStatus = require('http-status');
const razorpay = require('../../../config/razorpay');
const ApiError = require('../../../utils/ApiError');
const { Payment } = require('../../../models');

/**
 * Refund Payment
 * @param {String} paymentId
 * @returns {Promise<Object>}
 */
const processRefund = async (paymentId, refundAmount = null) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  const totalRefunded = payment.refundAmount || 0;

  if (totalRefunded >= payment.payableAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment already fully refunded');
  }

  /*
  |--------------------------------------------------------------------------
  | Only Paid Payment
  |--------------------------------------------------------------------------
  */

  if (payment.status !== 'paid') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only paid payments can be refunded');
  }

  /*
  |--------------------------------------------------------------------------
  | Payment Id Exists?
  |--------------------------------------------------------------------------
  */

  if (!payment.razorpayPaymentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Razorpay payment id not found');
  }

  /*
  |--------------------------------------------------------------------------
  | Refund API
  |--------------------------------------------------------------------------
  */

  const remainingRefund = payment.payableAmount - (payment.refundAmount || 0);

  const refundValue = refundAmount || remainingRefund;

  if (refundValue <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid refund amount');
  }

  if (refundValue > remainingRefund) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Maximum refundable amount is ₹${remainingRefund}`);
  }

  const amount = refundValue * 100;

  if (amount > payment.payableAmount * 100) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Refund amount cannot exceed payment amount');
  }

  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount,
  });

  /*
  |--------------------------------------------------------------------------
  | Save Refund
  |--------------------------------------------------------------------------
  */

  payment.refundId = refund.id;

  payment.refundStatus = refund.status;

  payment.refundAmount = (payment.refundAmount || 0) + refund.amount / 100;

  payment.status = 'refunded';

  payment.gatewayResponse = refund;

  payment.history.push({
    event: 'refund.processed',

    status: 'refunded',

    message: 'Refund processed successfully',

    payload: refund,
  });

  await payment.save();

  return {
    success: true,

    message: 'Refund processed successfully',

    refund,
  };
};

module.exports = {
  processRefund,
};
