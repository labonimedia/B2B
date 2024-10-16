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
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType2',
      required: true,
    },
    designNumber: {
      type: String
    },
   set: [{

      colour: { 
        type: String
      },
      colourImage: { 
        type: String
      },
      colourName: { 
        type: String
      },
      size: { 
        type: String
      },
      quantity: { 
        type: Number
      },
      price: {
        type: String
      }
    }],
    cartAddedDate: {
      type: Date,
      default: Date.now,
    }

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
