const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const socksSizeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
socksSizeSchema.plugin(toJSON);
socksSizeSchema.plugin(paginate);

const SocksSize = mongoose.model('SocksSize', socksSizeSchema);

module.exports = SocksSize;
