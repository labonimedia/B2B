const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const PurchaseOrderSchema = mongoose.Schema(
  {
    set: [
      {
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
    cartAddedDate: Date,
    poNumber: Number,
    retailerPOs: [{
      email: String,
      poNumber: Number,
    }],
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
PurchaseOrderSchema.plugin(toJSON);
PurchaseOrderSchema.plugin(paginate);

const PurchaseOrderType2 = mongoose.model('PurchaseOrderType2', PurchaseOrderSchema);

module.exports = PurchaseOrderType2;
