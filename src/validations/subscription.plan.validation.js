const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubscriptionPlan = {
  body: Joi.object().keys({
    planName: Joi.string().trim().required(),

    planCode: Joi.string().trim().uppercase().required(),

    description: Joi.string().allow('').optional(),

    amount: Joi.number().min(0).required(),

    discountType: Joi.string().valid('percentage', 'fixed').default('percentage'),

    discountValue: Joi.number().min(0).default(0),

    currency: Joi.string().default('INR'),

    validity: Joi.number().integer().min(1).required(),

    validityType: Joi.string().valid('days', 'months', 'years').required(),

    features: Joi.array().items(Joi.string()),

    maxProducts: Joi.number().integer().min(0).default(0),

    maxOrders: Joi.number().integer().min(0).default(0),

    maxUsers: Joi.number().integer().min(1).default(1),

    isPopular: Joi.boolean().default(false),

    isRecommended: Joi.boolean().default(false),

    status: Joi.string().valid('active', 'inactive').default('active'),

    createdBy: Joi.string().optional(),

    updatedBy: Joi.string().optional(),
  }),
};

const getSubscriptionPlans = {
  query: Joi.object().keys({
    planName: Joi.string(),

    planCode: Joi.string(),

    status: Joi.string().valid('active', 'inactive'),

    isPopular: Joi.boolean(),

    isRecommended: Joi.boolean(),

    sortBy: Joi.string(),

    limit: Joi.number().integer(),

    page: Joi.number().integer(),
  }),
};

const getSubscriptionPlan = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.string().custom(objectId),
  }),
};

const updateSubscriptionPlan = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.required().custom(objectId),
  }),

  body: Joi.object()
    .keys({
      planName: Joi.string().trim(),

      planCode: Joi.string().trim().uppercase(),

      description: Joi.string().allow(''),

      amount: Joi.number().min(0),

      discountType: Joi.string().valid('percentage', 'fixed'),

      discountValue: Joi.number().min(0),

      currency: Joi.string(),

      validity: Joi.number().integer().min(1),

      validityType: Joi.string().valid('days', 'months', 'years'),

      features: Joi.array().items(Joi.string()),

      maxProducts: Joi.number().integer().min(0),

      maxOrders: Joi.number().integer().min(0),

      maxUsers: Joi.number().integer().min(1),

      isPopular: Joi.boolean(),

      isRecommended: Joi.boolean(),

      status: Joi.string().valid('active', 'inactive'),

      updatedBy: Joi.string(),
    })
    .min(1),
};

const deleteSubscriptionPlan = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.string().custom(objectId),
  }),
};

const changeStatus = {
  params: Joi.object().keys({
    subscriptionPlanId: Joi.string().custom(objectId),
  }),

  body: Joi.object().keys({
    status: Joi.string().valid('active', 'inactive').required(),
  }),
};

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  changeStatus,
};
