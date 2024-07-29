const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wholesalerCategorySchema = mongoose.Schema(
  {
    category: {
      type: String,
    },
    categoryBy: {
      type: String,
    },
    shippingDiscount: {
      type: String,
    },
    productDiscount: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wholesalerCategorySchema.plugin(toJSON);
wholesalerCategorySchema.plugin(paginate);

const WholesalerCategory = mongoose.model('WholesalerCategory', wholesalerCategorySchema);

module.exports = WholesalerCategory;
