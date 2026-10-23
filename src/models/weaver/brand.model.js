const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

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
    visibility: {
      type: Boolean,
      default: true, // true means visible, false means hidden
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

const WeaverBrand = mongoose.model('WeaverBrand', brandSchema);

module.exports = WeaverBrand;
