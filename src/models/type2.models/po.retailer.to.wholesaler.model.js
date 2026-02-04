// const mongoose = require('mongoose');
// const { paginate, toJSON } = require('../plugins');

// const PORetailerToWholesalerSchema = new mongoose.Schema(
//   {
//     set: [
//       {
//         productBy: String,
//         designNumber: String,
//         colour: String,
//         colourImage: String,
//         colourName: String,
//         size: String,
//         brandName: {
//           type: String,
//         },
//         quantity: Number, // Requested by retailer
//         availableQuantity: {
//           type: Number,
//           default: 0,
//         }, // Updated by wholesaler
//         confirmed: {
//           type: Boolean,
//           default: false, // Confirmed by retailer if changes are made
//         },
//         status: {
//           type: String,
//           enum: ['pending', 'partial', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
//           default: 'pending',
//         },
//         manufacturerPrice: String,
//         price: String,
//         productType: String,
//         gender: String,
//         clothing: String,
//         subCategory: String,
//         hsnCode: {
//           type: String,
//         },
//         hsnGst: {
//           type: String,
//         },
//         hsnDescription: {
//           type: String,
//         },
//       },
//     ],
//     // transportDetails: transportDetailsSchema,
//     statusAll: {
//       type: String,
//       enum: ['pending', 'wholesaler_updated', 'processing', 'delivered', 'cancelled'],
//       default: 'pending',
//     },
//     email: String, // Retailer email
//     wholesalerEmail: String,
//     discount: Number,
//     retailerPoDate: {
//       type: Date,
//       default: Date.now,
//     },
//     poNumber: Number,
//     wholesaler: {
//       email: String,
//       fullName: String,
//       companyName: String,
//       address: String,
//       state: String,
//       country: String,
//       pinCode: String,
//       mobNumber: String,
//       GSTIN: String,
//     },
//     retailer: {
//       email: String,
//       fullName: String,
//       companyName: String,
//       address: String,
//       state: String,
//       country: String,
//       pinCode: String,
//       mobNumber: String,
//       GSTIN: String,
//       logo: String,
//       productDiscount: String,
//       category: String,
//     },
//     cartId: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// PORetailerToWholesalerSchema.plugin(toJSON);
// PORetailerToWholesalerSchema.plugin(paginate);

// const PORetailerToWholesaler = mongoose.model('PORetailerToWholesaler', PORetailerToWholesalerSchema);

// module.exports = PORetailerToWholesaler;

const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

/* -------------------- BANK DETAILS -------------------- */
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

/* -------------------- TRANSPORT DETAILS -------------------- */
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

/* -------------------- MAIN SCHEMA -------------------- */
const PORetailerToWholesalerSchema = new mongoose.Schema(
  {
    /* ---------- PRODUCT SET ---------- */
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

    /* ---------- ORDER LEVEL STATUS ---------- */
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
      ],
      default: 'pending',
    },

    /* ---------- TRANSPORT & PAYMENT ---------- */
    transportDetails: transportDetailsSchema,
    bankDetails: bankDetailsSchema,

    /* ---------- DATES & FLAGS ---------- */
    retailerConfirmedAt: Date,
    expDeliveryDate: Date,
    partialDeliveryDate: Date,

    invoiceGenerated: {
      type: Boolean,
      default: false,
    },

    /* ---------- META ---------- */
    email: String, // Retailer email
    wholesalerEmail: String,

    discount: Number,

    retailerPoDate: {
      type: Date,
      default: Date.now,
    },

    poNumber: Number,

    /* ---------- WHOLESALER DETAILS ---------- */
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

    /* ---------- RETAILER DETAILS ---------- */
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

    previousPoNumber: String,
    previousPoId: String,
    cartId: String,
  },
  {
    timestamps: true,
  }
);

/* -------------------- PLUGINS -------------------- */
PORetailerToWholesalerSchema.plugin(toJSON);
PORetailerToWholesalerSchema.plugin(paginate);

/* -------------------- INDEXES -------------------- */
PORetailerToWholesalerSchema.index({
  wholesalerEmail: 1,
  email: 1,
  statusAll: 1,
});

/* -------------------- MODEL -------------------- */
const PORetailerToWholesaler = mongoose.model(
  'PORetailerToWholesaler',
  PORetailerToWholesalerSchema
);

module.exports = PORetailerToWholesaler;
