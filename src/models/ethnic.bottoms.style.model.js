const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ethnicBottomsStyleSchema = mongoose.Schema(
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
ethnicBottomsStyleSchema.plugin(toJSON);
ethnicBottomsStyleSchema.plugin(paginate);

const EthnicBottomsStyle = mongoose.model('EthnicBottomsStyle', ethnicBottomsStyleSchema);

module.exports = EthnicBottomsStyle;
