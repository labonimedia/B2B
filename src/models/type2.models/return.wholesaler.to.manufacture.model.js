const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

/* ---------------- Transport Schema ---------------- */

const transportDetailsSchema = new mongoose.Schema({
  transportType: String,
  transporterCompanyName: String,
  vehicleNumber: String,
  contactNumber: Number,
  trackingId: String,
  modeOfTransport: {
    type: String,
    enum: ['road', 'railway', 'air', 'sea', 'other', 'self'],
  },
  dispatchDate: Date,
  expectedDeliveryDate: Date,
  deliveryDate: Date,
  remarks: String,
});

/* ---------------- Bank Schema ---------------- */

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: String,
  accountNumber: String,
  bankName: String,
  branchName: String,
  ifscCode: String,
  upiId: String,
});

/* ---------------- Main Return Schema ---------------- */

const returnW2MSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'POWholesalerToManufacturer',
      required: true,
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'M2WPerformaInvoice',
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
    },

    poNumber: Number,

    returnRequestNumber: Number,

    returnRequestGenerateDate: {
      type: Date,
      default: Date.now,
    },

    manufacturerEmail: {
      type: String,
      required: true,
    },

    wholesalerEmail: {
      type: String,
      required: true,
    },

    statusAll: {
      type: String,
      enum: [
        'return_requested',
        'return_checked',
        'return_approved',
        'return_rejected',
        'return_in_transit',
        'return_received',
        'credit_note_created',
        'resolved',
      ],
      default: 'return_requested',
    },

    deliveryItems: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        size: String,

        orderQuantity: Number,
        deliveredQuantity: Number,
        returnQuantity: Number,
        acceptedQuantity: Number,

        rate: Number,
        returnReason: String,
        otherReturnReason: String,

        manufacturerComments: String,
        wholesalerComments: String,

        returnStatus: {
          type: String,
          enum: ['requested', 'approved', 'rejected', 'in_transit', 'received', 'credited', 'resolved'],
          default: 'requested',
        },
      },
    ],

    totalQuantity: Number,
    totalAmount: Number,
    finalAmount: Number,

    manufacturerReturnRemarks: String,

    bankDetails: bankDetailsSchema,
    transportDetails: transportDetailsSchema,
  },
  { timestamps: true }
);

/* Unique per manufacturer */
returnW2MSchema.index({ manufacturerEmail: 1, returnRequestNumber: 1 }, { unique: true });

returnW2MSchema.plugin(toJSON);
returnW2MSchema.plugin(paginate);

const ReturnW2M = mongoose.model('ReturnW2M', returnW2MSchema);

module.exports = ReturnW2M;
