const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const braPadTypeSchema = mongoose.Schema(
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
braPadTypeSchema.plugin(toJSON);
braPadTypeSchema.plugin(paginate);

const BraPadType = mongoose.model('BraPadType', braPadTypeSchema);

module.exports = BraPadType;
