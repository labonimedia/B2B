const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const transportDetailsSchema = new mongoose.Schema({
  transportType: String,
  transporterCompanyName: String,
  vehicleNumber: String,
  contactNumber: Number,
  altContactNumber: Number,
  trackingId: String,
  modeOfTransport: {
    type: String,
    enum: ['road', 'railway', 'air', 'sea', 'other', 'self'],
  },
  dispatchDate: Date,
  expectedDeliveryDate: Date,
  deliveryDate: Date,
  deliveryAddress: String,
  remarks: String,
  gstNumber: String,
  contactPersonName: String,
  note: String,
});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: String,
  accountType: String,
  accountNumber: String,
  bankName: String,
  branchName: String,
  ifscCode: String,
  swiftCode: String,
  upiId: String,
  bankAddress: String,
});

/* ---------- main schema ---------- */

const returnRequestSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'POWholesalerToRetailer',
      required: true,
    },
    poNumber: {
      type: Number,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    returnRequestNumber: {
      type: Number,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'W2RPerformaInvoice',
      required: true,
    },
    invoiceDate: Date,
    returnRequestGenerateDate: {
      type: Date,
      default: Date.now,
    },
    poDate: Date,
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
    bankDetails: bankDetailsSchema,
    wholesalerEmail: {
      type: String,
      required: true,
    },
    retailerEmail: {
      type: String,
      required: true,
    },
    deliveryItems: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        colourImage: String,
        size: String,
        orderQuantity: Number,
        acceptedQuantity: Number,
        returnQuantity: Number,
        rate: Number,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        hsnCode: String,
        hsnGst: Number,
        hsnDescription: String,
        brandName: String,
        returnReason: String,
        otherReturnReason: String,
        wholesalerComments: String,
        retailerComments: String,
        returnStatus: {
          type: String,
          enum: ['requested', 'approved', 'rejected', 'in_transit', 'received', 'credited', 'resolved'],
          default: 'requested',
        },
      },
    ],
    wholesaler: {
      email: String,
      fullName: String,
      companyName: String,
      address: String,
      state: String,
      country: String,
      pinCode: String,
      mobNumber: String,
      GSTIN: String,
    },
    retailer: {
      email: String,
      fullName: String,
      companyName: String,
      address: String,
      state: String,
      country: String,
      pinCode: String,
      mobNumber: String,
      GSTIN: String,
      logo: String,
      productDiscount: String,
      category: String,
    },
    totalQuantity: Number,
    transportDetails: transportDetailsSchema,
    totalAmount: Number,
    discountApplied: Number,
    finalAmount: Number,
    wholesalerReturnRemarks: String,
  },
  { timestamps: true }
);

/* ---------- indexes ---------- */

returnRequestSchema.index({ wholesalerEmail: 1, returnRequestNumber: 1 }, { unique: true });

returnRequestSchema.index({
  wholesalerEmail: 1,
  retailerEmail: 1,
  statusAll: 1,
});

returnRequestSchema.plugin(toJSON);
returnRequestSchema.plugin(paginate);

const ReturnR2W = mongoose.model('ReturnR2W', returnRequestSchema);
module.exports = ReturnR2W;
