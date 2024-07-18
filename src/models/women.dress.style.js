const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const womenDressStyleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
womenDressStyleSchema.plugin(toJSON);
womenDressStyleSchema.plugin(paginate);

const WomenDressStyle = mongoose.model('WomenDressStyle', womenDressStyleSchema);

module.exports = WomenDressStyle;
