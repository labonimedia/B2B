const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sleevCutStyleSchema = mongoose.Schema(
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
sleevCutStyleSchema.plugin(toJSON);
sleevCutStyleSchema.plugin(paginate);

const SleevCutStyle = mongoose.model('SleevCutStyle', sleevCutStyleSchema);

module.exports = SleevCutStyle;
