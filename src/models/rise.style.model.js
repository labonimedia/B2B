const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const riseStyleSchema = mongoose.Schema(
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
riseStyleSchema.plugin(toJSON);
riseStyleSchema.plugin(paginate);

const RiseStyle = mongoose.model('RiseStyle', riseStyleSchema);

module.exports = RiseStyle;
