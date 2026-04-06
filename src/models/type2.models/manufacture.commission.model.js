const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const manufacturerCommissionCategorySchema = mongoose.Schema(
  {
    category: {
      type: String,
    },

    categoryBy: {
      type: String, // manufacturer email
    },

    productCommission: {
      type: String, // % or fixed
    },

    shippingCommission: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

manufacturerCommissionCategorySchema.plugin(toJSON);
manufacturerCommissionCategorySchema.plugin(paginate);

const ManufacturerCommissionCategory = mongoose.model(
  'ManufacturerCommissionCategory',
  manufacturerCommissionCategorySchema
);

module.exports = ManufacturerCommissionCategory;
