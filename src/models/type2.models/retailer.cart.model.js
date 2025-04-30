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
        // _id: false,
        // productId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'ProductType2',
        //   required: true,
        // },
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
        manufacturerPrice: String,
        price: {
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
// add plugin that converts mongoose to json
CartSchema.plugin(toJSON);
CartSchema.plugin(paginate);

const RetailerCartType2 = mongoose.model('RetailerCartType2', CartSchema);
module.exports = RetailerCartType2;
