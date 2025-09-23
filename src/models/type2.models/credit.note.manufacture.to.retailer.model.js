const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const creditNoteSchema = new mongoose.Schema(
  {
    creditNoteNumber: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    createdByEmail: {
      type: String,
      required: true,
    },
    createdByName: String,

    sender: {
      email: String,
      fullName: String,
      companyName: String,
      contactNumber: String,
    },
    receiver: {
      email: String,
      fullName: String,
      companyName: String,
      contactNumber: String,
    },

    set: [
      // {
      //     designNumber: String,
      //     hsnCode: {
      //         type: String,
      //     },
      //     hsnGst: {
      //         type: String,
      //     },
      //     hsnDescription: {
      //         type: String,
      //     },
      //     size: String,
      //     color: String,
      //     quantity: Number,
      //     price: Number,
      //     totalAmount: Number, // price * quantity
      //     reason: String,
      // }
      {
        productBy: String, // Manufacturer email
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        returnQuantity: Number, // Requested by retailer
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
         quantity: Number,
               returnReason: String,
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

    used: {
      type: Boolean,
      default: false,
    },

    usedInInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },

    usedAt: {
      type: Date,
    },

    createdAt: {
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

creditNoteSchema.plugin(toJSON);
creditNoteSchema.plugin(paginate);

const MtoRCreditNote = mongoose.model('MtoRCreditNote', creditNoteSchema);

module.exports = MtoRCreditNote;
