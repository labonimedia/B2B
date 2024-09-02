const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const coinPocketsSchema = mongoose.Schema(
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
coinPocketsSchema.plugin(toJSON);
coinPocketsSchema.plugin(paginate);

const CoinPockets = mongoose.model('CoinPockets', coinPocketsSchema);

module.exports = CoinPockets;
