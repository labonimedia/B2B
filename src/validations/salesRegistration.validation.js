
const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const createSalesRegistration = {
  body: Joi.object({
    subscriptionId: Joi.string()
      .required()
      .custom(objectId),

    discountType: Joi.string()
      .valid('percentage', 'fixed')
      .required(),

    discountValue: Joi.number()
      .min(0)
      .required(),

    discountMaxUses: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .required(),

    remarks: Joi.string()
      .allow('')
      .max(500),

    customer: Joi.object({
      fullName: Joi.string().required(),

      email: Joi.string()
        .email()
        .lowercase()
        .required(),

      password: Joi.string()
        .required()
        .custom(password),

      companyName: Joi.string().allow(''),

      mobileNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),

      contryCode: Joi.string().allow(''),

      userCategory: Joi.string()
        .valid('setwise', 'orderwise')
        .default('orderwise'),

      role: Joi.string()
        .valid(
          'manufacture',
          'wholesaler',
          'retailer',
          'channelPartner'
        )
        .required(),
    }).required(),
  }),
};

const getSalesRegistrations = {
  query: Joi.object({
    search: Joi.string().allow(''),
    customerRole: Joi.string().valid(
      'manufacture',
      'wholesaler',
      'retailer',
      'channelPartner'
    ),
    status: Joi.string().valid(
      'active',
      'completed',
      'expired',
      'cancelled'
    ),
    salesmanId: Joi.string().custom(objectId),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string(),
  }),
};

module.exports = {
  createSalesRegistration,
  getSalesRegistrations,
};
