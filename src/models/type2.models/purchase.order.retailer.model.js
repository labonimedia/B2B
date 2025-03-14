const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const PurchaseOrderRetailerSchema = mongoose.Schema(
  {
    set: [
      {
        status: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
          default: 'pending',
        },
        _id: false,
        productBy: String,
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number,
        manufacturerPrice: String,
        price: String,
      },
    ],
    statusAll: {
      type: String,
      enum: ['pending', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    email: String,
    wholesalerEmail: String,
    discount: Number,
    retailerPoDate: {
      type: Date,
      default: Date.now,
    },
    poNumber: Number,
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
PurchaseOrderRetailerSchema.plugin(toJSON);
PurchaseOrderRetailerSchema.plugin(paginate);

const PurchaseOrderRetailerType2 = mongoose.model('PurchaseOrderRetailerType2', PurchaseOrderRetailerSchema);

module.exports = PurchaseOrderRetailerType2;
