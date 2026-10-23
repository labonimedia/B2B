const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const referralCodeUsedSchema = mongoose.Schema(
  {
    byEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    refEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    refCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

referralCodeUsedSchema.index(
  {
    refEmail: 1,
    refCode: 1,
  },
  {
    unique: true,
  }
);

referralCodeUsedSchema.plugin(toJSON);
referralCodeUsedSchema.plugin(paginate);

module.exports = mongoose.model('ReferralCodeUsed', referralCodeUsedSchema);
