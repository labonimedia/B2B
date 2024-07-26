const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const retailerCategorySchema = mongoose.Schema(
  {
    category: {
      type: String,

    },
    categoryBy: {
        type: String,
      },
      discount: {
        type: String,
      }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
retailerCategorySchema.plugin(toJSON);
retailerCategorySchema.plugin(paginate);

const RetailerCategory = mongoose.model('RetailerCategory', retailerCategorySchema);

module.exports = RetailerCategory;
