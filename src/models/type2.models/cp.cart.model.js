const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const cpCartSchema = new mongoose.Schema(
  {
    cpEmail: { type: String, required: true },
    shopkeeperEmail: { type: String, required: true },
    productBy: { type: String, required: true },

    set: [
      {
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number,
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        hsnCode: String,
        hsnGst: Number,
        hsnDescription: String,
        brandName: String,
      },
    ],
  },
  { timestamps: true }
);

cpCartSchema.index({ cpEmail: 1, shopkeeperEmail: 1, productBy: 1 });

cpCartSchema.plugin(toJSON);
cpCartSchema.plugin(paginate);

module.exports = mongoose.model('CpCart', cpCartSchema);
