const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const topTypeSchema = mongoose.Schema(
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
topTypeSchema.plugin(toJSON);
topTypeSchema.plugin(paginate);

const TopType = mongoose.model('TopType', topTypeSchema);

module.exports = TopType;
