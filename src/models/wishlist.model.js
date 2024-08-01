const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wishListSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wishListSchema.plugin(toJSON);
wishListSchema.plugin(paginate);

const Wishlist = mongoose.model('Wishlist', wishListSchema);

module.exports = Wishlist;
