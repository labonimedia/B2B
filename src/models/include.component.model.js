const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const includeComponentSchema = mongoose.Schema(
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
includeComponentSchema.plugin(toJSON);
includeComponentSchema.plugin(paginate);

const IncludeComponent = mongoose.model('IncludeComponent', includeComponentSchema);

module.exports = IncludeComponent;
