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
// add plugin that converts mongoose to json
CartSchema.plugin(toJSON);
CartSchema.plugin(paginate);

const CartType2 = mongoose.model('CartType2', CartSchema);
module.exports = CartType2;
