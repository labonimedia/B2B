const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const fitTypeSchema = mongoose.Schema(
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
fitTypeSchema.plugin(toJSON);
fitTypeSchema.plugin(paginate);

const FitType = mongoose.model('FitType', fitTypeSchema);

module.exports = FitType;
