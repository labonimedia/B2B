const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const backStyleSchema = mongoose.Schema(
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
backStyleSchema.plugin(toJSON);
backStyleSchema.plugin(paginate);

const BackStyle = mongoose.model('BackStyle', backStyleSchema);

module.exports = BackStyle;
