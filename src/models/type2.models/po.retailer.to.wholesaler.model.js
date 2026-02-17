const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: String,
  accountNumber: String,
  accountType: String,
  bankName: String,
  branchName: String,
  ifscCode: String,
  swiftCode: String,
  upiId: String,
  bankAddress: String,
});

const transportDetailsSchema = new mongoose.Schema({
  transportType: String,
  transporterCompanyName: String,
  vehicleNumber: String,
  contactNumber: Number,
  altContactNumber: Number,
  trackingId: String,
  modeOfTransport: {
    type: String,
    enum: ['road', 'railway', 'air', 'sea', 'self', 'other'],
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

const PORetailerToWholesalerSchema = new mongoose.Schema(
  {
    set: [
      {
        productBy: String, // Wholesaler email
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number, // Requested by retailer
        availableQuantity: {
          type: Number,
          default: 0, // Updated by wholesaler
        },
        confirmed: {
          type: Boolean,
          default: false, // Retailer confirms wholesaler update
        },
        rejected: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: [
            'pending',
            'w_confirmed',
            'w_cancelled',
            'w_make_to_order',
            'w_partial',
            'r_confirmed',
            'r_cancelled',
            'processing',
            'shipped',
            'delivered',
          ],
          default: 'pending',
        },
        manufacturerPrice: String,
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        brandName: String,
        hsnCode: String,
        hsnGst: Number,
        hsnDescription: String,
      },
    ],
    statusAll: {
      type: String,
      enum: [
        'pending',
        'wholesaler_updated',
        'wholesaler_confirmed',
        'wholesaler_cancelled',
        'partial_delivery',
        'retailer_confirmed',
        'retailer_cancelled',
        'processing',
        'shipped',
        'delivered',
        'invoice_generated',
        'w_make_to_order',
      ],
      default: 'pending',
    },
    transportDetails: transportDetailsSchema,
    bankDetails: bankDetailsSchema,
    retailerConfirmedAt: Date,
    expDeliveryDate: Date,
    partialDeliveryDate: Date,
    invoiceGenerated: {
      type: Boolean,
      default: false,
    },
    email: String, // Retailer email
    wholesalerEmail: String,
    discount: Number,
    retailerPoDate: {
      type: Date,
      default: Date.now,
    },
    poNumber: Number,
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
    retailerNote: {
      type: String,
      trim: true,
    },
    wholesalerNote: {
      type: String,
      trim: true,
    },
    previousPoNumber: String,
    previousPoId: String,
    cartId: String,
  },
  {
    timestamps: true,
  }
);

PORetailerToWholesalerSchema.plugin(toJSON);
PORetailerToWholesalerSchema.plugin(paginate);

PORetailerToWholesalerSchema.index({
  wholesalerEmail: 1,
  email: 1,
  statusAll: 1,
});

const PORetailerToWholesaler = mongoose.model('PORetailerToWholesaler', PORetailerToWholesalerSchema);

module.exports = PORetailerToWholesaler;
