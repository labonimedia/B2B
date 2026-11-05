// const crypto = require('crypto');
// const httpStatus = require('http-status');
// const ApiError = require('../../../utils/ApiError');

// const { handlePaymentCaptured, handlePaymentFailed, handleRefundProcessed } = require('./payment.webhook.events.helper');

// /**
//  * Verify Razorpay Webhook Signature
//  */
// const verifyWebhookSignature = (headers, body) => {
//   const razorpaySignature = headers['x-razorpay-signature'];

//   if (!razorpaySignature) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Webhook signature missing');
//   }

//   const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');

//   if (generatedSignature !== razorpaySignature) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid webhook signature');
//   }

//   return true;
// };

// /**
//  * Razorpay Webhook Entry
//  */
// const processWebhook = async (headers, rawBody) => {
//   verifyWebhookSignature(headers, rawBody);

//   const payload = JSON.parse(rawBody.toString());

//   const { event } = payload;

//   switch (event) {
//     case 'payment.captured':
//       await handlePaymentCaptured(payload);
//       break;

//     case 'payment.failed':
//       await handlePaymentFailed(payload);
//       break;

//     case 'refund.processed':
//       await handleRefundProcessed(payload);
//       break;

//     default:
//       console.log(`Unhandled Razorpay Event : ${event}`);
//   }

//   return true;
// };

// module.exports = {
//   processWebhook,
// };


const crypto = require('crypto');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');

const {
  handlePaymentCaptured,
  handlePaymentFailed,
  handleRefundProcessed,
} = require('./payment.webhook.events.helper');

/**
 * Verify Razorpay Webhook Signature
 */
const verifyWebhookSignature = (headers, rawBody) => {
  const razorpaySignature = headers['x-razorpay-signature'];

  if (!razorpaySignature) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Webhook signature missing'
    );
  }

  if (!Buffer.isBuffer(rawBody)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid webhook body. Raw Buffer required'
    );
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Razorpay webhook secret not configured'
    );
  }

  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // Secure signature comparison
  const receivedBuffer = Buffer.from(razorpaySignature, 'hex');
  const generatedBuffer = Buffer.from(generatedSignature, 'hex');

  if (
    receivedBuffer.length !== generatedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, generatedBuffer)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid webhook signature'
    );
  }

  return true;
};

/**
 * Razorpay Webhook Entry
 */
const processWebhook = async (headers, rawBody) => {

  // 1. Verify Razorpay Signature
  verifyWebhookSignature(headers, rawBody);

  // 2. Parse Webhook Payload
  let payload;

  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid webhook JSON payload'
    );
  }

  const { event } = payload;

  // 3. Process Razorpay Events
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
      console.log(`Unhandled Razorpay Event: ${event}`);
      break;
  }

  return true;
};

module.exports = {
  processWebhook,
  verifyWebhookSignature,
};
