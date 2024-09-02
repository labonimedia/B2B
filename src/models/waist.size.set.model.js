const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const waistSizeSetchema = mongoose.Schema(
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
waistSizeSetchema.plugin(toJSON);
waistSizeSetchema.plugin(paginate);

const WaistSizeSet = mongoose.model('WaistSizeSet', waistSizeSetchema);

module.exports = WaistSizeSet;
