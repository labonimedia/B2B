const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password).optional(),
    fullName: Joi.string().required(),
    companyName: Joi.string().optional(),
    role: Joi.string().required(),
    code: Joi.string().optional(),
    contryCode: Joi.string(),
    userCategory: Joi.string().optional(),
    mobileNumber: Joi.string().optional(),
    refByEmail: Joi.string().optional(),
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
