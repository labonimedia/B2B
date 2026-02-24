const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

/* ---------- Transaction Schema ---------- */

const walletTransactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['credit', 'debit'],
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
    creditNoteNumber: Number,
    creditInvoiceNumber: Number,
    debitInvoiceNumber: Number,
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

/* ---------- Wallet Schema ---------- */

const walletSchema = new Schema(
  {
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    wholesalerEmail: {
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
  { timestamps: true }
);

// ✅ Unique pair
walletSchema.index({ manufacturerEmail: 1, wholesalerEmail: 1 }, { unique: true });

walletSchema.plugin(toJSON);
walletSchema.plugin(paginate);

const M2WWallet = mongoose.model('M2WWallet', walletSchema);

module.exports = M2WWallet;
