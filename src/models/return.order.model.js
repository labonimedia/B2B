const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const returnOrderSchema = mongoose.Schema(
  {
    challanNo: {
      type: String,
      trim: true,
    },
    challanDate: {
      type: Date,
    },
    companyAddress: {
      type: String,
    },
    companyContact: {
      type: String,
    },
    companyDetails: {
      type: String,
    },
    companyEmail: {
      type: String,
    },
    companyGSTIN: {
      type: String,
    },
    companyName: {
      type: String,
    },
    courierCompany: {
      type: String,
    },
    customerAddress: {
      type: String,
    },
    customerDetails: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerGSTIN: {
      type: String,
    },
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    discount: {
      type: String,
    },
    ebill: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    lorryReceiptNo: {
      type: String,
    },
    otherCompanyName: {
      type: String,
    },
    placeOfSupply: {
      type: String,
    },
    products: [
      {
        demandQty: String,
        designNo: String,
        gst: String,
        issue: String,
        subIssue: String,
        name: String,
        qty: String,
        rate: String,
        srNo: String,
        taxableValue: String,
        total: String,
      },
    ],
    receiptNo: {
      type: String,
      trim: true,
    },
    roundedOffTotal: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: String,
      trim: true,
    },
    totalGST: {
      type: String,
      trim: true,
    },
    totalInWords: {
      type: String,
      trim: true,
    },
    totalRate: {
      type: String,
      trim: true,
    },
    trackingNo: {
      type: String,
      trim: true,
    },
    transportCompany: {
      type: String,
      trim: true,
    },
    transportType: {
      type: String,
      trim: true,
    },
    vehicleNo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
returnOrderSchema.plugin(toJSON);
returnOrderSchema.plugin(paginate);

const ReturnOrder = mongoose.model('ReturnOrder', returnOrderSchema);

module.exports = ReturnOrder;
