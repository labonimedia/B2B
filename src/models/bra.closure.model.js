const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const braClosureSchema = mongoose.Schema(
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
braClosureSchema.plugin(toJSON);
braClosureSchema.plugin(paginate);

const BraClosure = mongoose.model('BraClosure', braClosureSchema);

module.exports = BraClosure;
