const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const closureTypeSchema = mongoose.Schema(
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
closureTypeSchema.plugin(toJSON);
closureTypeSchema.plugin(paginate);

const ClosureType = mongoose.model('ClosureType', closureTypeSchema);

module.exports = ClosureType;
