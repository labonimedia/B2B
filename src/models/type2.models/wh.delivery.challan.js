const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const whDeliveryChallanSchema = mongoose.Schema(
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
    retailerEmail: String,
    wholesalerEmail: String,
    whDileveryClallnDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'proceed', 'checked'],
      // default: 'pending',
    },
    poNumber: Number,
    deliveryChallanNumber: Number,
    retailerPOs: [
      {
        email: String,
        poNumber: Number,
      },
    ],
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
whDeliveryChallanSchema.plugin(toJSON);
whDeliveryChallanSchema.plugin(paginate);

const whDeliveryChallan = mongoose.model('whDeliveryChallan', whDeliveryChallanSchema);

module.exports = whDeliveryChallan;
