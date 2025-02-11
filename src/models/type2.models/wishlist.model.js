const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const wishListType2Schema = mongoose.Schema(
  {
    productId: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    productOwnerEmail: {
      type: String,
      trim: true,
    },
    productUser: {
      type: String,
      enum: ['wholesaler', 'manufacturer'],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wishListType2Schema.plugin(toJSON);
wishListType2Schema.plugin(paginate);

const WishListType2 = mongoose.model('WishListType2', wishListType2Schema);

module.exports = WishListType2;
