const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const waistBandSchema = mongoose.Schema(
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
waistBandSchema.plugin(toJSON);
waistBandSchema.plugin(paginate);

const WaistBand = mongoose.model('WaistBand', waistBandSchema);

module.exports = WaistBand;
