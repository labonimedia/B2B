const Joi = require('joi');
const { password } = require('./custom.validation');

// const register = {
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().custom(password).optional(),
//     fullName: Joi.string().required(),
//     companyName: Joi.string().optional(),
//     role: Joi.string().required(),
//     code: Joi.string().optional(),
//     contryCode: Joi.string(),
//     userCategory: Joi.string().optional(),
//     mobileNumber: Joi.string().optional(),
//     refByEmail: Joi.string().optional(),
//   }),
// };

const register = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email() // Validates that the email format is correct
      .lowercase(), // Ensures the email is lowercase (similar to the Mongoose schema)

    password: Joi.string()
      .min(8) // Password should be at least 8 characters (from Mongoose schema)
      .pattern(/^[a-zA-Z0-9]+$/) // Ensures password contains at least one letter and one number
      .optional(),

    fullName: Joi.string().required(), // Required full name

    companyName: Joi.string().optional(), // Company name is optional

    role: Joi.string()
      .valid('superadmin', 'manufacture', 'wholesaler', 'retailer', 'user') // Role validation to match the Mongoose enum
      .default('user') // Default role is 'user'
      .required(),

    code: Joi.string().optional(), // Optional code

    contryCode: Joi.string().optional(), // Optional country code

    userCategory: Joi.string()
      .valid('setwise', 'orderwise') // Validation for user category to match Mongoose enum
      .default('orderwise')
      .optional(),

    mobileNumber: Joi.string()
      .pattern(/^[0-9]{10}$/) // Mobile number must be exactly 10 digits
      .required(), // Mobile number is required

    refByEmail: Joi.array().items(Joi.string()).optional(), // Optional array of reference emails

    blackListed: Joi.array().items(Joi.string()).optional(), // Optional array of blacklisted users
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  query: Joi.object().keys({
    email: Joi.string().email().required(),
    fullName: Joi.string(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
