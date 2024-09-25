const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const topStyleSchema = mongoose.Schema(
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
topStyleSchema.plugin(toJSON);
topStyleSchema.plugin(paginate);

const TopStyle = mongoose.model('TopStyle', topStyleSchema);

module.exports = TopStyle;
