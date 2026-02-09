const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const CartSchema = new mongoose.Schema(
  {
    productBy: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    designNumber: {
      type: String,
    },
    set: [
      {
        productBy: {
          type: String,
        },
        designNumber: {
          type: String,
        },
        colour: {
          type: String,
        },
        colourImage: {
          type: String,
        },
        colourName: {
          type: String,
        },
        size: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        manufacturerPrice: {
          type: String,
        },
        price: {
          type: String,
        },
        productType: {
          type: String,
        },
        gender: {
          type: String,
        },
        clothing: {
          type: String,
        },
        subCategory: {
          type: String,
        },
        hsnCode: {
          type: String,
        },
        hsnGst: {
          type: String,
        },
        hsnDescription: {
          type: String,
        },
        brandName: {
          type: String,
        },
        mrp: {
          type: String,
        },
      },
    ],
    cartAddedDate: {
      type: Date,
      default: Date.now,
    },
    wholesalerEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Plugins
CartSchema.plugin(toJSON);
CartSchema.plugin(paginate);

const RetailerCartType2 = mongoose.model('RetailerCartType2', CartSchema);
module.exports = RetailerCartType2;
