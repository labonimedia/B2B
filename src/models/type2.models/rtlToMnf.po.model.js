const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const rtlToMnfPurchaseOrderSchema = mongoose.Schema(
  {
    set: [
      {
        _id: false,
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number,
        price: String,
        productBy: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    email: String,
    productBy: String,
    retaolerPoDate: {
      type: Date,
      default: Date.now,
    },
    poNumber: Number,
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
rtlToMnfPurchaseOrderSchema.plugin(toJSON);
rtlToMnfPurchaseOrderSchema.plugin(paginate);

const rtlToMnfPurchaseOrderType2 = mongoose.model('rtltomnfpotype2', rtlToMnfPurchaseOrderSchema);

module.exports = rtlToMnfPurchaseOrderType2;
