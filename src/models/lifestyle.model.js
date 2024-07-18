const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const lifestyleSchema = mongoose.Schema(
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
lifestyleSchema.plugin(toJSON);
lifestyleSchema.plugin(paginate);

const Lifestyle = mongoose.model('Lifestyle', lifestyleSchema);

module.exports = Lifestyle;
