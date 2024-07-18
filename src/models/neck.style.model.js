const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const neckStyleSchema = mongoose.Schema(
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
neckStyleSchema.plugin(toJSON);
neckStyleSchema.plugin(paginate);

const NeckStyle = mongoose.model('NeckStyle', neckStyleSchema);

module.exports = NeckStyle;
