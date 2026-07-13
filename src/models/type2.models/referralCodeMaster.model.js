const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const referralCodeMasterSchema = mongoose.Schema(
  {
    refCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    refNote: {
      type: String,
      trim: true,
    },
    refMessage: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

referralCodeMasterSchema.index({ refCode: 1 });

referralCodeMasterSchema.plugin(toJSON);
referralCodeMasterSchema.plugin(paginate);

module.exports = mongoose.model('ReferralCodeMaster', referralCodeMasterSchema);