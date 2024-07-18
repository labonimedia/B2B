const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const materialSchema = mongoose.Schema(
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
materialSchema.plugin(toJSON);
materialSchema.plugin(paginate);

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
