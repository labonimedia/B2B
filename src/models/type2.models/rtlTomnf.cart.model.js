const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const rtlToMnfCartSchema = new mongoose.Schema(
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
        _id: false,
        // productId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'ProductType2',
        //   required: true,
        // },
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
rtlToMnfCartSchema.plugin(toJSON);
rtlToMnfCartSchema.plugin(paginate);

const rtlToMnfCartType2 = mongoose.model('rtlToMnfCartType2', rtlToMnfCartSchema);
module.exports = rtlToMnfCartType2;
