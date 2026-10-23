const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    mainGroupCode: {
      type: String,
      trim: true,
      uppercase: true,
    },

    mainGroupName: {
      type: String,
      required: true,
      trim: true,
    },

    headCategory: {
      type: String,
      trim: true,
    },

    debitCredit: {
      type: String,
      trim: true,
    },

    positionCode: {
      type: Number,
      default: 0,
    },

    remark: {
      type: String,
      trim: true,
    },
    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverManufacture',
      required: true,
      index: true,
    },

    weaverEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same group name should not repeat
// for the same Weaver.
masterSchema.index(
  {
    weaverId: 1,
    mainGroupName: 1,
  },
  {
    unique: true,
  }
);

// Weaver-wise listing
masterSchema.index({
  weaverId: 1,
});

// Weaver + position sorting
masterSchema.index({
  weaverId: 1,
  positionCode: 1,
});

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverMainGroupMaster = mongoose.model('WeaverMainGroupMaster', masterSchema);

module.exports = WeaverMainGroupMaster;
