const Joi = require('joi');

const createOrder = {
  body: Joi.object().keys({
    amount: Joi.number().required().min(100),
    currency: Joi.string().default('INR'),
  }),
};

const verifyPayment = {
  body: Joi.object().keys({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
  }),
};

module.exports = {
  createOrder,
  verifyPayment,
};