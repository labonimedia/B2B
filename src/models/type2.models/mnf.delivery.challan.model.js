const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const mnfDeliveryChallanSchema = mongoose.Schema(
  {
    avilableSet: [
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
    orderedSet: [
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
    email: String,
    productBy: String,
    nextOrderDelivetryDate: {
      type: Date,
    },
    mnfDileveryClallnDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'Partially-Fulfilled', 'Fulfilled', 'Rejected', 'Auto-Forwarded', 'Canceled'],
    },
    poNumber: Number,
    deliveryChallanNumber: Number,
    retailerPOs: [
      {
        email: String,
        poNumber: Number,
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
mnfDeliveryChallanSchema.plugin(toJSON);
mnfDeliveryChallanSchema.plugin(paginate);

const MnfDeliveryChallan = mongoose.model('mnfDeliveryChallan', mnfDeliveryChallanSchema);

module.exports = MnfDeliveryChallan;
