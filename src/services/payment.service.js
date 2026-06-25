const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOrder = async (body, user) => {
  const { amount } = body;

  if (amount < 100) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Minimum amount should be 100 paise'
    );
  }

  const receipt = `receipt_${Date.now()}`;

  const options = {
    amount,
    currency: 'INR',
    receipt,
  };

  const order = await razorpay.orders.create(options);

  await Payment.create({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt,
    userEmail: user?.email,
    status: 'created',
  });

  return order;
};

const verifyPayment = async (body) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  const generatedSignature = crypto
    .createHmac(
      'sha256',
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid payment signature'
    );
  }

  const payment = await Payment.findOne({
    orderId: razorpay_order_id,
  });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Order not found'
    );
  }

  payment.status = 'paid';
  payment.paymentId = razorpay_payment_id;
  payment.verifiedAt = new Date();

  await payment.save();

  return {
    success: true,
    payment,
  };
};

module.exports = {
  createOrder,
  verifyPayment,
};