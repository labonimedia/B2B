const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sareeStyle = mongoose.Schema(
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
sareeStyle.plugin(toJSON);
sareeStyle.plugin(paginate);

const SareeStyle = mongoose.model('SareeStyle', sareeStyle);

module.exports = SareeStyle;
