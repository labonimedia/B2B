const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const braStyleSchema = mongoose.Schema(
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
braStyleSchema.plugin(toJSON);
braStyleSchema.plugin(paginate);

const BraStyle = mongoose.model('BraStyle', braStyleSchema);

module.exports = BraStyle;
