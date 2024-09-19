const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const waistTypeSchema = mongoose.Schema(
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
waistTypeSchema.plugin(toJSON);
waistTypeSchema.plugin(paginate);

const WaistType = mongoose.model('WaistType', waistTypeSchema);

module.exports = WaistType;
