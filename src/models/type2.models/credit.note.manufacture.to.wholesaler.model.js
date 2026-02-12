const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const creditNoteSchema = new mongoose.Schema(
  {
    creditNoteNumber: {
      type: Number,
    },

    invoiceNumber: {
      type: Number,
      required: true,
    },

    returnOrderNumber: {
      type: Number,
      required: true,
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'POWholesalerToManufacturer',
      required: true,
    },

    manufacturerEmail: {
      type: String,
      required: true,
    },

    wholesalerEmail: {
      type: String,
      required: true,
    },

    set: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        size: String,
        returnQuantity: Number,
        acceptedQuantity: Number,
        manufacturerPrice: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        returnReason: String,
        manufacturerComments: String,
        otherReturnReason: String,
        hsnCode: String,
        hsnGst: Number,
        hsnDescription: String,
        brandName: String,
      },
    ],

    totalCreditAmount: {
      type: Number,
      required: true,
    },

    totalReturnItem: Number,
    totalAcceptedReturnItem: Number,

    used: {
      type: Boolean,
      default: false,
    },

    usedInInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'POWholesalerToManufacturer',
    },

    usedInInvoiceNumber: Number,
    usedAt: Date,

    generatedOn: {
      type: Date,
      default: Date.now,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Unique per manufacturer
creditNoteSchema.index({ manufacturerEmail: 1, creditNoteNumber: 1 }, { unique: true });

creditNoteSchema.plugin(toJSON);
creditNoteSchema.plugin(paginate);

const M2WCreditNote = mongoose.model('M2WCreditNote', creditNoteSchema);

module.exports = M2WCreditNote;
