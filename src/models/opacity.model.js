const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const opacitySchema = mongoose.Schema(
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
opacitySchema.plugin(toJSON);
opacitySchema.plugin(paginate);

const Opacity = mongoose.model('Opacity', opacitySchema);

module.exports = Opacity;
