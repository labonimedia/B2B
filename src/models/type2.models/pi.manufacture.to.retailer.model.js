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

const appliedCreditNoteSchema = new mongoose.Schema({
  creditNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MtoRCreditNote',
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

const performaInvoiceSchema = new mongoose.Schema(
  {
    poId: { type: mongoose.Schema.Types.ObjectId, ref: 'PORetailerToManufacturer', required: true },
    poNumber: { type: Number, required: true },
    invoiceNumber: { type: String },
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
        price: Number,
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
    totalAmount: Number,
    discountApplied: Number,
    finalAmount: Number,
    appliedCreditNotes: [appliedCreditNoteSchema],
    totalCreditNoteAmountUsed: {
      type: Number,
      default: 0,
    },
    finalAmountPayable: {
      type: Number,
    },
    returnRequestGenerated: String,
  },
  { timestamps: true }
);

performaInvoiceSchema.index({ manufacturerEmail: 1, invoiceNumber: 1 }, { unique: true });

performaInvoiceSchema.plugin(toJSON);
performaInvoiceSchema.plugin(paginate);

performaInvoiceSchema.index({
  manufacturerEmail: 1,
  retailerEmail: 1,
  statusAll: 1,
});

const M2RPerformaInvoice = mongoose.model('M2RPerformaInvoice', performaInvoiceSchema);
module.exports = M2RPerformaInvoice;
