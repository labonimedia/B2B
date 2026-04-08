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

const POChannelPartnerToManufacturerSchema = new mongoose.Schema(
  {
    set: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        colourImage: String,
        size: String,
        totalQuantity: Number,
        quantity: Number,
        expectedQty: Number,
        availableQuantity: {
          type: Number,
          default: 0,
        },
        confirmed: {
          type: Boolean,
          default: false,
        },
        rejected: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: [
            'pending',
            'm_cancelled',
            'm_confirmed',
            'm_partial_delivery',
            'cp_confirmed',
            'cp_cancelled',
            'make_to_order',
            'processing',
          ],
          default: 'pending',
        },
        clothing: String,
        gender: String,
        subCategory: String,
        productType: String,
        manufacturerPrice: String,
        price: String,
        hsnCode: String,
        hsnGst: String,
        hsnDescription: String,
        brandName: String,
      },
    ],
    statusAll: {
      type: String,
      enum: [
        'pending',
        'm_order_confirmed',
        'm_order_updated',
        'm_order_cancelled',
        'm_partial_delivery',
        'cp_order_confirmed',
        'cp_order_cancelled',
        'processing',
        'shipped',
        'delivered',
        'make_to_order',
        'invoice_generated',
      ],
      default: 'pending',
    },
    transportDetails: transportDetailsSchema,
    bankDetails: bankDetailsSchema,
    manufacturerEmail: String,
    channelPartnerEmail: String,
    retailerEmail: String,
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
      profileImg: String,
      logo: String,
    },
    channelPartner: {
      email: String,
      fullName: String,
      companyName: String,
      address: String,
      state: String,
      country: String,
      pinCode: String,
      mobNumber: String,
      GSTIN: String,
      profileImg: String,
      logo: String,
    },
    retailer: {
      email: String,
      fullName: String,
      shopName: String,
      city: String,
      state: String,
      mobileNumber: String,
      address: String,
      GSTIN: String,
      logo: String,
    },
    subTotal: Number,
    shippingCharge: {
      type: Number,
      default: 0,
    },
    discountByCP: {
      type: Number,
      default: 0,
    },
    commissionFromManufacturer: {
      type: Number,
      default: 0,
    },
    finalAmount: Number,
    cpEarning: Number,
    manufacturerNote: String,
    cpNote: String,
    expDeliveryDate: Date,
    partialDeliveryDate: Date,
    cpConfirmedAt: Date,
    invoiceGenerated: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'M2CPPerformaInvoice',
    },
    poNumber: Number,
    previousPoNumber: String,
    previousPoId: String,
    cartId: String,
  },
  {
    timestamps: true,
  }
);

// 🔹 Plugins
POChannelPartnerToManufacturerSchema.plugin(toJSON);
POChannelPartnerToManufacturerSchema.plugin(paginate);

// 🔹 Index
POChannelPartnerToManufacturerSchema.index({
  channelPartnerEmail: 1,
  manufacturerEmail: 1,
  statusAll: 1,
});

module.exports = mongoose.model('POChannelPartnerToManufacturer', POChannelPartnerToManufacturerSchema);
