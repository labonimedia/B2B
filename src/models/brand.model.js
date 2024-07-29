const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const brandSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
    },
    brandDescription: {
      type: String,
    },
    brandLogo: {
      type: String,
    },
    brandOwner: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
