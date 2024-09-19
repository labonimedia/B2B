const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const finishTypeSchema = mongoose.Schema(
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
finishTypeSchema.plugin(toJSON);
finishTypeSchema.plugin(paginate);

const FinishType = mongoose.model('FinishType', finishTypeSchema);

module.exports = FinishType;
