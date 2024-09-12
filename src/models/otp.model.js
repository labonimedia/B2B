const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 180,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Otp
 */

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
