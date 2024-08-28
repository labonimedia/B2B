const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productTypeSchema.plugin(toJSON);
productTypeSchema.plugin(paginate);

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
