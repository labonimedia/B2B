const mongoose = require('mongoose');
const { paginate } = require('./plugins');

const currencySchema = mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbol_native: {
      type: String,
      required: true,
    },
    decimal_digits: {
      type: Number,
      required: true,
    },
    rounding: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    name_plural: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

currencySchema.plugin(paginate);

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
