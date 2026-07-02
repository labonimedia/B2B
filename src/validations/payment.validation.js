  const Joi = require('joi');
  const { objectId } = require('./custom.validation');

  /**
   * Create Razorpay Order
   */
  const createOrder = {
    body: Joi.object().keys({
      subscriptionId: Joi.string().required().custom(objectId),
    }),
  };

  /**
   * Verify Razorpay Payment
   */
  const verifyPayment = {
    body: Joi.object().keys({
      razorpay_order_id: Joi.string().required(),

      razorpay_payment_id: Joi.string().required(),

      razorpay_signature: Joi.string().required(),
    }),
  };

  /**
   * Get Payment By Id
   */
  const getPayment = {
    params: Joi.object().keys({
      paymentId: Joi.string().required().custom(objectId),
    }),
  };

  /**
   * Get All Payments
   */
  const getPayments = {
    query: Joi.object().keys({
      userEmail: Joi.string().email(),

      status: Joi.string().valid('created', 'pending', 'paid', 'failed', 'cancelled', 'expired', 'refunded'),

      subscriptionId: Joi.string().custom(objectId),

      paymentMethod: Joi.string(),

      sortBy: Joi.string(),

      limit: Joi.number().integer(),

      page: Joi.number().integer(),
    }),
  };

  /**
   * Payment Failed API
   */
  const paymentFailed = {
    body: Joi.object().keys({
      razorpayOrderId: Joi.string().required(),

      failureReason: Joi.string().required(),

      failureCode: Joi.string().allow('', null),

      gatewayResponse: Joi.object().optional(),
    }),
  };

  /**
   * Retry Payment
   */
  const retryPayment = {
    params: Joi.object().keys({
      paymentId: Joi.string().required().custom(objectId),
    }),
  };

  /**
   * Refund Request
   */
  const refundPayment = {
    params: Joi.object().keys({
      paymentId: Joi.string().custom(objectId),
    }),

    body: Joi.object().keys({
      refundAmount: Joi.number().min(1).optional(),
    }),
  };
  const getLatestPayment = {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId),
    }),
  };

  module.exports = {
    createOrder,
    verifyPayment,
    getPayment,
    getPayments,
    paymentFailed,
    retryPayment,
    refundPayment,
    getLatestPayment,
  };
