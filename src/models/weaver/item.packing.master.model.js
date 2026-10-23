const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    remark: {
      type: String,
      trim: true,
    },
    rate: {
      type: Number,
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

const WeaverItemPackingMaster = mongoose.model('WeaverItemPackingMaster', masterSchema);

module.exports = WeaverItemPackingMaster;
