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

const POWholesalerToManufacturerSchema = new mongoose.Schema(
  {
    set: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        size: String,
        totalQuantity: Number,
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
            'w_confirmed',
            'w_cancelled',
            'make_to_order',
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
        brandName: {
          type: String,
        },
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
        'w_order_confirmed',
        'w_order_cancelled',
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
    wholesalerEmail: String,
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
      productDiscount: String,
      category: String,
      profileImg: String,
      logo: String,
    },
    expDeliveryDate: Date,
    partialDeliveryDate: Date,
    wholesalerConfirmedAt: Date,
    manufacturerNote: {
      type: String,
      trim: true,
    },
    wholesalerNote: {
      type: String,
      trim: true,
    },
    poNumber: Number,
    wholesalerPODateCreated: {
      type: Date,
      default: Date.now,
    },
    invoiceGenerated: {
      type: Boolean,
      default: false, // partail or actual delivery date
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'M2WPerformaInvoice',
    },
    previousPoNumber: String,
    previousPoId: String,
    cartId: String,
  },
  {
    timestamps: true,
  }
);

POWholesalerToManufacturerSchema.plugin(toJSON);
POWholesalerToManufacturerSchema.plugin(paginate);

POWholesalerToManufacturerSchema.index({
  wholesalerEmail: 1,
  manufacturerEmail: 1,
  statusAll: 1,
});

const POWholesalerToManufacturer = mongoose.model('POWholesalerToManufacturer', POWholesalerToManufacturerSchema);

module.exports = POWholesalerToManufacturer;
