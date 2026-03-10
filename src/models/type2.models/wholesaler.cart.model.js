const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const WholesalerCartSchema = new mongoose.Schema(
  {
    productBy: {
      type: String, // Manufacturer email
      required: true,
    },
    wholesalerEmail: {
      type: String,
      required: true,
    },
    manufacturerEmail: {
      type: String,
      required: true,
    },
    designNumber: {
      type: String,
    },
    set: [
      {
        productBy: String,
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number,
        manufacturerPrice: String,
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        hsnCode: String,
        hsnGst: String,
        hsnDescription: String,
        brandName: String,
        mrp: String,
      },
    ],
    cartAddedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

WholesalerCartSchema.index({ wholesalerEmail: 1 });
WholesalerCartSchema.index({ manufacturerEmail: 1 });

WholesalerCartSchema.plugin(toJSON);
WholesalerCartSchema.plugin(paginate);

const WholesalerCartToManufacturer = mongoose.model('WholesalerCartToManufacturer', WholesalerCartSchema);

module.exports = WholesalerCartToManufacturer;
