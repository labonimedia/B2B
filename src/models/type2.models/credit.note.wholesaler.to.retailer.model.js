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
      ref: 'W2RPerformaInvoice',
      required: true,
    },
    wholesalerEmail: {
      type: String,
      required: true,
    },
    retailerEmail: {
      type: String,
      required: true,
    },

    set: [
      {
        productBy: String, // Wholesaler email
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        returnQuantity: Number,
        acceptedQuantity: Number,
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        quantity: Number,
        returnReason: String,
        wholesalerComments: String,
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
      ref: 'W2RPerformaInvoice',
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

creditNoteSchema.index({ wholesalerEmail: 1, creditNoteNumber: 1 }, { unique: true });

creditNoteSchema.index({
  wholesalerEmail: 1,
  retailerEmail: 1,
  used: 1,
  isDeleted: 1,
});

creditNoteSchema.plugin(toJSON);
creditNoteSchema.plugin(paginate);

const W2RCreditNote = mongoose.model('W2RCreditNote', creditNoteSchema);
module.exports = W2RCreditNote;
