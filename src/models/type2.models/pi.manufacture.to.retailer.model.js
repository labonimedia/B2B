// const mongoose = require('mongoose');
// const { paginate, toJSON } = require('../plugins');

// // Embedded schema for Transport Details

// const transportDetailsSchema = new mongoose.Schema({
//   transportType: {
//     type: String,
//     trim: true,
//   },
//   transporterCompanyName: {
//     type: String,
//     trim: true,
//   },
//   vehicleNumber: {
//     type: String,
//     trim: true,
//   },
//   contactNumber: {
//     type: Number,
//     trim: true,
//   },
//   altContactNumber: {
//     type: Number,
//     trim: true,
//   },
//   trackingId: {
//     type: String,
//     trim: true,
//   },
//   modeOfTransport: {
//     type: String,
//     enum: ['road', 'railway', 'air', 'sea', 'other', 'self'],
//   },
//   dispatchDate: {
//     type: Date,
//     // required: true,
//   },
//   expectedDeliveryDate: {
//     type: Date,
//   },
//   deliveryDate: {
//     type: Date,
//   },
//   deliveryAddress: {
//     type: String,
//     // required: true,
//   },
//   remarks: {
//     type: String,
//     trim: true,
//   },
//   gstNumber: {
//     type: String,
//     trim: true,
//     // required: true,
//   },
//   contactPersonName: {
//     type: String,
//     trim: true,
//   },
//   note: {
//     type: String,
//     trim: true,
//   },
// });

// // Embedded schema for Bank Details
// const bankDetailsSchema = new mongoose.Schema({
//   accountHolderName: {
//     type: String,
//     // required: true,
//     trim: true,
//   },
//   accountType: {
//     type: String,
//     // required: true,
//     trim: true,
//   },
//   accountNumber: {
//     type: String,
//     // required: true,
//     trim: true,
//   },
//   bankName: {
//     type: String,
//     // required: true,
//     trim: true,
//   },
//   branchName: {
//     type: String,
//     trim: true,
//   },
//   ifscCode: {
//     type: String,
//     // required: true,
//     trim: true,
//   },
//   swiftCode: {
//     type: String,
//     // required: true,
//     trim: true,
//   },
//   upiId: {
//     type: String,
//     trim: true,
//   },
//   bankAddress: {
//     type: String,
//     trim: true,
//   },
// });

// // Main PerformaInvoice schema
// const performaInvoiceSchema = new mongoose.Schema(
//   {
//     poId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'PORetailerToManufacturer',
//       required: true,
//     },
//     poNumber: {
//       type: Number,
//       required: true,
//     },
//     invoiceNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     invoiceDate: {
//       type: Date,
//       default: Date.now,
//     },
//     invoiceRecievedDate: {
//       type: Date,
//     },
//     statusAll: {
//       type: String,
//       enum: ['created', 'dispatched', 'in_transit', 'partially_delivered', 'delivered', 'cancelled'],
//       default: 'created',
//     },

//     bankDetails: bankDetailsSchema,

//     manufacturerEmail: {
//       type: String,
//       required: true,
//     },
//     retailerEmail: {
//       type: String,
//       required: true,
//     },

//     deliveryItems: [
//       {
//         designNumber: String,
//         colour: String,
//         colourName: String,
//         colourImage: String,
//         size: String,
//         quantity: Number,
//         returnQuantity: Number,
//         productType: String,
//         gender: String,
//         clothing: String,
//         subCategory: String,
//         hsnCode: {
//           type: String,
//         },
//         hsnGst: {
//           type: Number,
//         },
//         hsnDescription: {
//           type: String,
//         },
//         status: {
//           type: String,
//           enum: ['pending', 'dispatched', 'delivered', 'partial'],
//           default: 'pending',
//         },
//         brandName: {
//           type: String,
//         },
//       },
//     ],
//     manufacturer: {
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
//     totalQuantity: Number,
//     transportDetails: transportDetailsSchema,
//     totalAmount: Number,
//     discountApplied: Number,
//     finalAmount: Number,
//     returnRequestGenerated: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// performaInvoiceSchema.plugin(toJSON);
// performaInvoiceSchema.plugin(paginate);

// const M2RPerformaInvoice = mongoose.model('M2RPerformaInvoice', performaInvoiceSchema);
// module.exports = M2RPerformaInvoice;

const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

// Embedded schema for Transport Details
const transportDetailsSchema = new mongoose.Schema({
  transportType: { type: String, trim: true },
  transporterCompanyName: { type: String, trim: true },
  vehicleNumber: { type: String, trim: true },
  contactNumber: { type: Number, trim: true },
  altContactNumber: { type: Number, trim: true },
  trackingId: { type: String, trim: true },
  modeOfTransport: { type: String, enum: ['road', 'railway', 'air', 'sea', 'other', 'self'] },
  dispatchDate: { type: Date },
  expectedDeliveryDate: { type: Date },
  deliveryDate: { type: Date },
  deliveryAddress: { type: String },
  remarks: { type: String, trim: true },
  gstNumber: { type: String, trim: true },
  contactPersonName: { type: String, trim: true },
  note: { type: String, trim: true },
});

// Embedded schema for Bank Details
const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String, trim: true },
  accountType: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  bankName: { type: String, trim: true },
  branchName: { type: String, trim: true },
  ifscCode: { type: String, trim: true },
  swiftCode: { type: String, trim: true },
  upiId: { type: String, trim: true },
  bankAddress: { type: String, trim: true },
});

/**
 * NEW SCHEMA to attach multiple Credit Notes
 */
const appliedCreditNoteSchema = new mongoose.Schema({
  creditNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MtoRCreditNote',
   // required: true,
  },
  creditNoteNumber: {
    type: Number,
   // required: true,
  },
  usedAmount: {
    type: Number,
  //  required: true, // Amount from this CN used on this invoice
  },
  appliedOn: {
    type: Date,
    //default: Date.now,
  },
});

// Main PerformaInvoice schema
const performaInvoiceSchema = new mongoose.Schema(
  {
    poId: { type: mongoose.Schema.Types.ObjectId, ref: 'PORetailerToManufacturer', required: true },
    poNumber: { type: Number, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    invoiceRecievedDate: { type: Date },

    statusAll: {
      type: String,
      enum: ['created', 'dispatched', 'in_transit', 'partially_delivered', 'delivered', 'cancelled'],
      default: 'created',
    },

    bankDetails: bankDetailsSchema,

    manufacturerEmail: { type: String, required: true },
    retailerEmail: { type: String, required: true },

    deliveryItems: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        colourImage: String,
        size: String,
        quantity: Number,
        returnQuantity: Number,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        hsnCode: { type: String },
        hsnGst: { type: Number },
        hsnDescription: { type: String },
        status: { type: String, enum: ['pending', 'dispatched', 'delivered', 'partial'], default: 'pending' },
        brandName: { type: String },
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
    totalAmount: Number, // Before discount
    discountApplied: Number, // Manufacturer discount
    finalAmount: Number, // Final invoice value before CN use

    /**
     * 🆕 MULTIPLE CREDIT NOTES APPLIED
     */
    appliedCreditNotes: [appliedCreditNoteSchema],

    totalCreditNoteAmountUsed: {
      type: Number,
      default: 0,
    },

    finalAmountPayable: {
      type: Number, // finalAmount - totalCreditNoteAmountUsed
    },

    returnRequestGenerated: String,
  },
  { timestamps: true }
);

performaInvoiceSchema.plugin(toJSON);
performaInvoiceSchema.plugin(paginate);

const M2RPerformaInvoice = mongoose.model('M2RPerformaInvoice', performaInvoiceSchema);
module.exports = M2RPerformaInvoice;
