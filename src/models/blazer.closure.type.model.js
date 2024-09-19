const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const blazerClouserTypeSchema = mongoose.Schema(
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
blazerClouserTypeSchema.plugin(toJSON);
blazerClouserTypeSchema.plugin(paginate);

const BlazerClouserType = mongoose.model('BlazerClouserType', blazerClouserTypeSchema);

module.exports = BlazerClouserType;
