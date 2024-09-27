const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const otpService = require('./otp.service');


const smtpConfig = {
  host: 'smtp.secureserver.net',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'noreply@fashiontradershub.com',
    pass: 'Goodwill#120', // Hardcoded password
  },
};
const transport = nodemailer.createTransport(smtpConfig);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to) => {
  const otpCode = await otpService.generateOTP();
  await otpService.createOtp(to, otpCode);
  const subject = 'Welcome to Fashion Traders Hub - Reset your password OTP';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user

Welcome to FashionTradersHub.com!

We are excited to have you join our platform, where fashion traders connect, share, and grow. To complete your registration and gain full access to all our features, please verify your account using the One-Time Password (OTP) below.

Your OTP: ${otpCode}

Simply enter this OTP on the verification page to reset your password.

If you did not sign up for FashionTradersHub.com, please disregard this email.

We look forward to supporting your journey in the world of fashion trading!

Best regards,
The Fashion Traders Hub Team
www.fashiontradershub.com`
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, fullName) => {
  const otpCode = await otpService.generateOTP();
  await otpService.createOtp(to, otpCode);
  const subject = 'Welcome to Fashion Traders Hub - Complete Your Registration with OTP';
  // replace this url with the link to the email verification page of your front-end app
  const text = `
  Dear ${fullName},

Welcome to FashionTradersHub.com!

We are excited to have you join our platform, where fashion traders connect, share, and grow. To complete your registration and gain full access to all our features, please verify your account using the One-Time Password (OTP) below.

Your OTP: ${otpCode}

Simply enter this OTP on the verification page to confirm your registration.

If you did not sign up for FashionTradersHub.com, please disregard this email.

We look forward to supporting your journey in the world of fashion trading!

Best regards,
The Fashion Traders Hub Team
www.fashiontradershub.com`
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendInvitationToDistributer = async (to, fullName) => {
  const subject = ' Exclusive Invitation: Join Fashion Traders Hub for Seamless B2B Transactions!';

  const text = `Dear ${fullName},

We are pleased to invite you to join FashionTradersHub.com, an advanced B2B platform designed to make our business interactions smoother, faster, and more efficient.

As one of our trusted distributors, by joining Fashion Traders Hub, you'll gain access to several powerful tools and features that will help streamline your business operations:

- View the Latest Product Listings: Stay updated with our newest collections and product releases in real time.
- Place Orders Online: Conveniently browse, select, and order products directly through the platform, saving you time and effort.
- Generate Proforma Invoices: Instantly create and download professional invoices for your orders, making transactions seamless.
- Track Orders and Shipments: Stay informed about your order status, inventory updates, and delivery timelines, all in one place.

Ready to simplify your business processes? Click the link below to register and join Fashion Traders Hub:
https://b2b.fashiontradershub.com/#/authentication/signup/${to}

This platform will help us both collaborate more efficiently and drive success in the fast-paced world of fashion trading.

We look forward to seeing you on Fashion Traders Hub!

Best regards,
[Manufacturer Name]
Registered Manufacturer at Fashion Traders Hub
www.fashiontradershub.com`;
  await sendEmail(to, subject, text);
};
module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendInvitationToDistributer,
};
