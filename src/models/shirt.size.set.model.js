const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const shirtSizeSetSchema = mongoose.Schema(
  {
    size: {
      type: String,
      trim: true,
    },
    number:{
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
shirtSizeSetSchema.plugin(toJSON);
shirtSizeSetSchema.plugin(paginate);

const ShirtSizeSet = mongoose.model('ShirtSizeSet', shirtSizeSetSchema);

module.exports = ShirtSizeSet;
