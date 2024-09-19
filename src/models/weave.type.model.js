const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const weaveTypeSchema = mongoose.Schema(
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
weaveTypeSchema.plugin(toJSON);
weaveTypeSchema.plugin(paginate);

const WeavetType = mongoose.model('WeavetType', weaveTypeSchema);

module.exports = WeavetType;
