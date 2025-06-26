const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

// Embedded schema for Transport Details

// Embedded schema for Bank Details
const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  branchName: {
    type: String,
    trim: true,
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
  },
    swiftCode: {
    type: String,
    required: true,
    trim: true,
  },
  upiId: {
    type: String,
    trim: true,
  },
  bankAddress: {
    type: String,
    trim: true,
  },
});

// Main PerformaInvoice schema
const performaInvoiceSchema = new mongoose.Schema(
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
      unique: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    statusAll: {
      type: String,
      enum: [
        'created',
        'dispatched',
        'in_transit',
        'partially_delivered',
        'delivered',
        'cancelled',
      ],
      default: 'created',
    },

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
        quantity: Number,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        status: {
          type: String,
          enum: ['pending', 'dispatched', 'delivered', 'partial'],
          default: 'pending',
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
    totalAmount: Number,
    discountApplied: Number,
    finalAmount: Number,
  },
  {
    timestamps: true,
  }
);

performaInvoiceSchema.plugin(toJSON);
performaInvoiceSchema.plugin(paginate);

const M2RPerformaInvoice = mongoose.model('M2RPerformaInvoice', performaInvoiceSchema);
module.exports = M2RPerformaInvoice;
