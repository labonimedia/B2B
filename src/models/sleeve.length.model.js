const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sleeveLengthSchema = mongoose.Schema(
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
sleeveLengthSchema.plugin(toJSON);
sleeveLengthSchema.plugin(paginate);

const SleeveLength = mongoose.model('SleeveLength', sleeveLengthSchema);

module.exports = SleeveLength;
