const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const layerCompressionSchema = mongoose.Schema(
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
layerCompressionSchema.plugin(toJSON);
layerCompressionSchema.plugin(paginate);

const LayerCompression = mongoose.model('LayerCompression', layerCompressionSchema);

module.exports = LayerCompression;
