const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const specialFeatureSchema = mongoose.Schema(
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
specialFeatureSchema.plugin(toJSON);
specialFeatureSchema.plugin(paginate);

const SpecialFeature = mongoose.model('SpecialFeature', specialFeatureSchema);

module.exports = SpecialFeature;
