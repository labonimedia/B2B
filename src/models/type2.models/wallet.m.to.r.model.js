const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

// Individual transaction (credit / debit)
const walletTransactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['credit', 'debit'], // credit = credit note created, debit = used in invoice
      required: true,
    },

    // Amount of this transaction
    amount: {
      type: Number,
      required: true,
    },

    // After this transaction, what is the wallet balance?
    balanceAfter: {
      type: Number,
      required: true,
    },

    // // Optional references (for tracking)
    // creditNoteId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'MtoRCreditNote',
    // },

    creditNoteNumber: {
      type: Number,
    },

    // creditInvoiceId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'M2RPerformaInvoice',
    // },

    creditInvoiceNumber: {
      type: Number,
    },

    //     debitInvoiceId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'M2RPerformaInvoice',
    // },
    
    debitInvoiceNumber: {
      type: Number,
    },

    // Extra info / remarks
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

// Wallet schema for (manufacturerEmail + retailerEmail)
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

    // Current available balance for this pair
    balance: {
      type: Number,
      default: 0,
    },

    // For reporting
    totalCredited: {
      type: Number,
      default: 0,
    },
    totalDebited: {
      type: Number,
      default: 0,
    },

    // All transactions in order (credits + debits)
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
