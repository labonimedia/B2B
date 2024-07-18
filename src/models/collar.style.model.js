const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const collarStyleSchema = mongoose.Schema(
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
collarStyleSchema.plugin(toJSON);
collarStyleSchema.plugin(paginate);

const CollarStyle = mongoose.model('CollarStyle', collarStyleSchema);

module.exports = CollarStyle;
