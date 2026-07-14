const httpStatus = require('http-status');
const { ReferralCodeUsed } = require('../../models');
const ApiError = require('../../utils/ApiError');

const add = async (body) => {
  const { refEmail, refCode } = body;

  const existingReferralCode = await ReferralCodeUsed.findOne({
    refEmail: refEmail.trim().toLowerCase(),
    refCode: refCode.trim().toUpperCase(),
  });

  if (existingReferralCode) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Referral code already used by this email'
    );
  }

  return ReferralCodeUsed.create(body);
};

const check = async (refEmail, refCode) => {
  const existingReferralCode = await ReferralCodeUsed.findOne({
    refEmail: refEmail.trim().toLowerCase(),
    refCode: refCode.trim().toUpperCase(),
  });

  if (existingReferralCode) {
    return {
      isDuplicate: true,
      message: 'Referral code already used by this email',
    };
  }

  return {
    isDuplicate: false,
    message: 'Referral code can be used',
  };
};

const get = async (filter = {}) => {
  const query = {};

  if (filter.byEmail) {
    query.byEmail = filter.byEmail.trim().toLowerCase();
  }

  if (filter.refEmail) {
    query.refEmail = filter.refEmail.trim().toLowerCase();
  }

  if (filter.refCode) {
    query.refCode = filter.refCode.trim().toUpperCase();
  }

  return ReferralCodeUsed.find(query);
};

const remove = async (id) => {
  return ReferralCodeUsed.findByIdAndDelete(id);
};

module.exports = {
  add,
  check,
  get,
  remove,
};