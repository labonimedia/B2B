const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const womenStyleSchema = mongoose.Schema(
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
womenStyleSchema.plugin(toJSON);
womenStyleSchema.plugin(paginate);

const WomenStyle = mongoose.model('WomenStyle', womenStyleSchema);

module.exports = WomenStyle;
