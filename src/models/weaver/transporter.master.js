const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gstNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    city: {
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

const WeaverTransporterMaster = mongoose.model('WeaverTransporterMaster', masterSchema);

module.exports = WeaverTransporterMaster;
