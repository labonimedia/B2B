const { Otp } = require('../models');
// const config = require('../config/config');
// const ApiError = require('../utils/ApiError');

const createOtp = async (email, otp) => {
  const otpDoc = {
    email,
    otp,
  };
  await Otp.create(otpDoc);
};

const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000); // generates a 6-digit random number
  return otp.toString().padStart(6, '0'); // pads with zeros to ensure 6 digits
};

const verifyOtp = async (email, otp) => {
  const otpDoc = await Otp.findOne({ email, otp });
  if (!otpDoc || !otpDoc.otp) {
    throw new Error('Otp does not match');
  }

  await Otp.deleteMany({ email });

  return true;
};

module.exports = {
  createOtp,
  generateOTP,
  verifyOtp,
};
