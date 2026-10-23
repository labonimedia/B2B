const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    remark: {
      type: String,
      trim: true,
    },
    cityCode: {
      type: Number,
      required: true,
      trim: true,
    },
    wholeSaleRate: {
      type: Number,
      required: true,
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

const WeaverCityMaster = mongoose.model('WeaverCityMaster', masterSchema);

module.exports = WeaverCityMaster;
