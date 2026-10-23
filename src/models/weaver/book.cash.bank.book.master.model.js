const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    // ==========================================
    // BOOK DETAILS
    // ==========================================

    type: {
      type: String,
      required: true,
      trim: true,
    },

    bookNo: {
      type: Number,
      required: true,
    },

    // ==========================================
    // ACCOUNT DETAILS
    // ==========================================

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverAcountMaster',
    },

    accountName: {
      type: String,
      trim: true,
    },

    shortName: {
      type: String,
      trim: true,
    },

    accountNo: {
      type: String,
      trim: true,
    },

    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    // ==========================================
    // BANK DETAILS
    // ==========================================

    ccLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    chequePrint: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // WEAVER / TENANT DETAILS
    // ==========================================

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

// ==========================================
// INDEXES
// ==========================================

// Same book number should not repeat
// for the same Weaver.
masterSchema.index(
  {
    weaverId: 1,
    bookNo: 1,
  },
  {
    unique: true,
  }
);

// Weaver-wise listing
masterSchema.index({
  weaverId: 1,
  isActive: 1,
});

// Search optimization
masterSchema.index({
  weaverId: 1,
  accountName: 1,
});

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverCashBankBookMaster = mongoose.model('WeaverCashBankBookMaster', masterSchema);

module.exports = WeaverCashBankBookMaster;
