const { ReferralCodeMaster } = require('../../models');

const add = async (body) => {
  return ReferralCodeMaster.create(body);
};

const get = async () => {
  return ReferralCodeMaster.find();
};

const remove = async (id) => {
  return ReferralCodeMaster.findByIdAndDelete(id);
};

const checkReferralCode = async (refCode) => {
  if (!refCode) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Referral code is required'
    );
  }

  const referralCode = await ReferralCodeMaster.findOne({
    refCode: refCode.trim().toUpperCase(),
  });

  if (!referralCode) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Invalid referral code'
    );
  }

  return {
    isValid: true,
    message: 'Referral code is valid',
    data: referralCode,
  };
};

module.exports = { add, get, remove, checkReferralCode };