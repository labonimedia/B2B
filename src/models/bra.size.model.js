const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const braSizeSchema = mongoose.Schema(
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
braSizeSchema.plugin(toJSON);
braSizeSchema.plugin(paginate);

const BraSize = mongoose.model('BraSize', braSizeSchema);

module.exports = BraSize;
