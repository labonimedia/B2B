const crypto = require('crypto');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');

const { handlePaymentCaptured, handlePaymentFailed, handleRefundProcessed } = require('./payment.webhook.events.helper');

/**
 * Verify Razorpay Webhook Signature
 */
const verifyWebhookSignature = (headers, body) => {
  const razorpaySignature = headers['x-razorpay-signature'];

  if (!razorpaySignature) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Webhook signature missing');
  }

  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');

  if (generatedSignature !== razorpaySignature) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid webhook signature');
  }

  return true;
};

/**
 * Razorpay Webhook Entry
 */
const processWebhook = async (headers, rawBody) => {
  verifyWebhookSignature(headers, rawBody);

  const payload = JSON.parse(rawBody.toString());

  const { event } = payload;

  switch (event) {
    case 'payment.captured':
      await handlePaymentCaptured(payload);
      break;

    case 'payment.failed':
      await handlePaymentFailed(payload);
      break;

    case 'refund.processed':
      await handleRefundProcessed(payload);
      break;

    default:
      console.log(`Unhandled Razorpay Event : ${event}`);
  }

  return true;
};

module.exports = {
  processWebhook,
};
