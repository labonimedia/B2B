const crypto = require('crypto');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');

const verifySignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (generatedSignature !== signature) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment signature');
  }
};

module.exports = {
  verifySignature,
};
