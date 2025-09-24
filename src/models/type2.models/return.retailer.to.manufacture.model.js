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

// Bank details
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

// Main Return Request schema
const returnRequestSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PORetailerToManufacturer',
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
      //required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'M2RPerformaInvoice',
      required: true,
    },
    invoiceDate: {
      type: Date,
    },
        returnRequestGenerateDate: {
      type: Date,
       default: Date.now,
    },
       poDate: {
      type: Date,
    },
    // 🔹 Overall status of this Return Request
    statusAll: {
      type: String,
      enum: [
        'return_requested', // Retailer created request
        'return_checked', // Manufacturer verified request
        'return_approved', // Approved by manufacturer
        'return_rejected', // Rejected
        'return_in_transit', // Goods in return transit
        'return_received', // Manufacturer received goods
        'credit_note_created', // Credit note issued
        'resolved', // Fully resolved
      ],
      default: 'return_requested',
    },
    bankDetails: bankDetailsSchema,
    manufacturerEmail: {
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
        // Return-related details
        returnReason: String,
        otherReturnReason: String,
        manufacturerComments: String,
        retailerComments: String,
        // 🔹 Per-set return status
        returnStatus: {
          type: String,
          enum: [
            'requested', // Retailer initiated return
            'approved', // Approved by manufacturer
            'rejected', // Rejected
            'in_transit', // Item is being returned
            'received', // Manufacturer received item
            'credited', // Credit note issued for this item
            'resolved', // Completed
          ],
          default: 'requested',
        },
      },
    ],
    manufacturer: {
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
    manufacturerReturnRemarks: String,
  },
  {
    timestamps: true,
  }
);

// ✅ Add the compound index here
returnRequestSchema.index(
  { manufacturerEmail: 1, returnRequestNumber: 1 },
  { unique: true }
);

returnRequestSchema.plugin(toJSON);
returnRequestSchema.plugin(paginate);

const ReturnR2M = mongoose.model('ReturnR2M', returnRequestSchema);
module.exports = ReturnR2M;
