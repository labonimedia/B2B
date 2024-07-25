const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const discountCategorySchema = mongoose.Schema(
  {
    category: {
      type: String,

    },
    categoryBy: {
        type: String,
      }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
discountCategorySchema.plugin(toJSON);
discountCategorySchema.plugin(paginate);

const DiscountCategory = mongoose.model('DiscountCategory', discountCategorySchema);

module.exports = DiscountCategory;
