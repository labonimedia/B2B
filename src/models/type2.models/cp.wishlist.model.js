const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const cpWishlistSchema = mongoose.Schema(
  {
    cpEmail: String,
    shopkeeperEmail: String,
    productId: String,
    productOwnerEmail: String,
  },
  { timestamps: true }
);

cpWishlistSchema.index({ cpEmail: 1, shopkeeperEmail: 1 });

cpWishlistSchema.plugin(toJSON);
cpWishlistSchema.plugin(paginate);

module.exports = mongoose.model('CpWishlist', cpWishlistSchema);
