const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

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

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  bankName: { type: String, required: true, trim: true },
  branchName: { type: String, trim: true },
  ifscCode: { type: String, required: true, trim: true },
  swiftCode: { type: String, required: true, trim: true },
  upiId: { type: String, trim: true },
  bankAddress: { type: String, trim: true },
});

const appliedCreditNoteSchema = new mongoose.Schema({
  creditNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'M2WCreditNote',
  },
  creditNoteNumber: {
    type: Number,
  },
  usedAmount: {
    type: Number,
  },
  appliedOn: {
    type: Date,
  },
});

const m2wPerformaInvoiceSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'POWholesalerToManufacturer',
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
    invoiceRecievedDate: { type: Date },
    invoiceDate: {
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
    bankDetails: bankDetailsSchema,
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
        hsnCode: {
          type: String,
        },
        hsnGst: {
          type: String,
        },
        hsnDescription: { type: String },
        status: {
          type: String,
          enum: ['pending', 'dispatched', 'delivered', 'partial'],
          default: 'pending',
        },
        wholesalerConfirmed: {
          type: Boolean,
          default: false,
        },
        brandName: { type: String },
      },
    ],
    totalQuantity: Number,
    totalAmount: Number,
    transportDetails: transportDetailsSchema,
    discountApplied: Number,
    appliedCreditNotes: [appliedCreditNoteSchema],
    finalAmount: Number,
    wholesalerInvoiceConfirmed: {
      type: Boolean,
      default: false,
    },
    statusAll: {
      type: String,
      enum: ['created', 'dispatched', 'in_transit', 'partially_delivered', 'delivered', 'cancelled'],
      default: 'created',
    },
    totalCreditNoteAmountUsed: {
      type: Number,
      default: 0,
    },
    returnRequestGenerated: String,
    finalAmountPayable: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

m2wPerformaInvoiceSchema.index({ manufacturerEmail: 1, invoiceNumber: 1 }, { unique: true });

m2wPerformaInvoiceSchema.plugin(toJSON);
m2wPerformaInvoiceSchema.plugin(paginate);

m2wPerformaInvoiceSchema.index({
  manufacturerEmail: 1,
  wholesalerEmail: 1,
  statusAll: 1,
});

const M2WPerformaInvoice = mongoose.model('M2WPerformaInvoice', m2wPerformaInvoiceSchema);

module.exports = M2WPerformaInvoice;
