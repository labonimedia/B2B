const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const patternShema = mongoose.Schema(
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
patternShema.plugin(toJSON);
patternShema.plugin(paginate);

const Pattern = mongoose.model('Pattern', patternShema);

module.exports = Pattern;
