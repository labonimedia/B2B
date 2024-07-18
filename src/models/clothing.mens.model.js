const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const clothingMensSchema = mongoose.Schema(
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
clothingMensSchema.plugin(toJSON);
clothingMensSchema.plugin(paginate);

const ClothingMens = mongoose.model('ClothingMens', clothingMensSchema);

module.exports = ClothingMens;
