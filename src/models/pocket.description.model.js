const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const poketDiscriptionSchema = mongoose.Schema(
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
poketDiscriptionSchema.plugin(toJSON);
poketDiscriptionSchema.plugin(paginate);

const PoketDiscription = mongoose.model('PoketDiscription', poketDiscriptionSchema);

module.exports = PoketDiscription;
