const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = new mongoose.Schema({
  srNo: { type: String },
  name: { type: String },
  designNo: { type: String },
  qty: { type: String },
  demandQty: { type: String },
  otherIssue: { type: String },
  issue: { type: String },
  subIssue: { type: String },
  recivedQty: { type: String },
  rate: { type: String },
  taxableValue: { type: String },
  gst: { type: String },
  total: { type: String },
});

const issueProductsSchema = new mongoose.Schema({
  discount: {
    type: String,
  },
  challanDate: { type: String },
  challanNo: { type: String },
  companyName: { type: String },
  companyEmail: { type: String }, // manufacture
  companyAddress: { type: String },
  companyContact: { type: String },
  companyDetails: { type: String },
  companyGSTIN: { type: String },
  customerName: { type: String },
  customerAddress: { type: String },
  customerEmail: { type: String }, // wholesaler
  customerDetails: { type: String },
  customerGSTIN: { type: String },
  customerPhone: { type: String },
  eWayNo: { type: String },
  placeOfSupply: { type: String },
  products: { type: [productSchema] },
  totalRate: { type: Number },
  totalGST: { type: Number },
  totalAmount: { type: Number },
  totalInWords: { type: String },
  roundedOffTotal: { type: Number },
  transport: { type: String },
  transportType: { type: String },
  vehicleNumber: { type: String },
  lrNo: { type: String },
  logoUrl: { type: String },
});

// add plugin that converts mongoose to json
issueProductsSchema.plugin(toJSON);
issueProductsSchema.plugin(paginate);

const IssueProducts = mongoose.model('IssueProducts', issueProductsSchema);

module.exports = IssueProducts;
