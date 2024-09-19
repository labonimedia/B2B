const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cupSizeSchema = mongoose.Schema(
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
cupSizeSchema.plugin(toJSON);
cupSizeSchema.plugin(paginate);

const CupSize = mongoose.model('CupSize', cupSizeSchema);

module.exports = CupSize;
