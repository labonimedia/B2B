const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

const walletTransactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['credit', 'debit'], // credit = credit note created, debit = used in invoice
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    creditNoteNumber: {
      type: Number,
    },
    creditInvoiceNumber: {
      type: Number,
    },
    debitInvoiceNumber: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const walletSchema = new Schema(
  {
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    retailerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    totalCredited: {
      type: Number,
      default: 0,
    },
    totalDebited: {
      type: Number,
      default: 0,
    },
    transactions: [walletTransactionSchema],
    currency: {
      type: String,
      default: 'INR',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Make manufacturer + retailer pair unique
walletSchema.index(
  { manufacturerEmail: 1, retailerEmail: 1 },
  { unique: true }
);

walletSchema.plugin(toJSON);
walletSchema.plugin(paginate);

const MtoRWallet = mongoose.model('MtoRWallet', walletSchema);

module.exports = MtoRWallet;
