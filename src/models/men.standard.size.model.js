const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const menStandardSizeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
        type: Number,
        // required: true,
      }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
menStandardSizeSchema.plugin(toJSON);
menStandardSizeSchema.plugin(paginate);

const MenStandardSize = mongoose.model('MenStandardSize', menStandardSizeSchema);

module.exports = MenStandardSize;
