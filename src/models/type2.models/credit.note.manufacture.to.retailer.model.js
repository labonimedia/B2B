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
      ref: 'M2RPerformaInvoice',
      required: true,
    },
    manufacturerEmail: {
      type: String,
      required: true,
    },
    retailerEmail: {
      type: String,
      required: true,
    },
    set: [
      {
        productBy: String, // Manufacturer email
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
        manufacturerComments: String,
        acceptedQuantity: Number,
        otherReturnReason: String,
        hsnCode: {
          type: String,
        },
        hsnGst: {
          type: Number,
        },
        hsnDescription: {
          type: String,
        },
        brandName: {
          type: String,
        },
      },
    ],
    totalCreditAmount: {
      type: Number,
      required: true,
    },
    totalReturnItem: {
      type: Number,
    },
    totalAcceptedReturnItem: {
      type: Number,
    },
    used: {
      type: Boolean,
      default: false,
    },
    usedInInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'M2RPerformaInvoice',
    },
    usedInInvoiceNumber: {
      type: Number,
    },
    usedAt: {
      type: Date,
    },
    generatedOn: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// ✅ Add the compound index here
creditNoteSchema.index({ manufacturerEmail: 1, creditNoteNumber: 1 }, { unique: true });
creditNoteSchema.index({
  manufacturerEmail: 1,
  retailerEmail: 1,
  used: 1,
  isDeleted: 1,
});

creditNoteSchema.plugin(toJSON);
creditNoteSchema.plugin(paginate);

const MtoRCreditNote = mongoose.model('MtoRCreditNote', creditNoteSchema);

module.exports = MtoRCreditNote;
