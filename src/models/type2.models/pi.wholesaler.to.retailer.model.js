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

const appliedCreditNoteSchema = new mongoose.Schema({
  creditNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WtoRCreditNote',
  },
  creditNoteNumber: Number,
  usedAmount: Number,
  appliedOn: Date,
});

/* ---------- main schema ---------- */

const w2rPerformaInvoiceSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'POWholesalerToRetailer',
      required: true,
    },
    poNumber: { type: Number, required: true },

    invoiceNumber: { type: String },
    invoiceDate: { type: Date, default: Date.now },
    invoiceRecievedDate: Date,

    statusAll: {
      type: String,
      enum: ['created', 'dispatched', 'in_transit', 'partially_delivered', 'delivered', 'cancelled'],
      default: 'created',
    },

    bankDetails: bankDetailsSchema,

    wholesalerEmail: { type: String, required: true },
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
        price: Number,
        subCategory: String,
        hsnCode: String,
        hsnGst: Number,
        hsnDescription: String,
        status: {
          type: String,
          enum: ['pending', 'dispatched', 'delivered', 'partial'],
          default: 'pending',
        },
        brandName: String,
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

    appliedCreditNotes: [appliedCreditNoteSchema],
    totalCreditNoteAmountUsed: { type: Number, default: 0 },
    finalAmountPayable: Number,

    returnRequestGenerated: String,
  },
  { timestamps: true }
);

w2rPerformaInvoiceSchema.index({ wholesalerEmail: 1, invoiceNumber: 1 }, { unique: true });

w2rPerformaInvoiceSchema.index({
  wholesalerEmail: 1,
  retailerEmail: 1,
  statusAll: 1,
});

w2rPerformaInvoiceSchema.plugin(toJSON);
w2rPerformaInvoiceSchema.plugin(paginate);

const W2RPerformaInvoice = mongoose.model('W2RPerformaInvoice', w2rPerformaInvoiceSchema);
module.exports = W2RPerformaInvoice;
