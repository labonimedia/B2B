const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    default: {
      type: String,
      trim: true,
    },
    remark: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverManufacture',
      required: true,
      index: true,
    },
    weaverEmail: {
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
masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverItemStockTypeMaster = mongoose.model('WeaverItemStockTypeMaster', masterSchema);

module.exports = WeaverItemStockTypeMaster;
