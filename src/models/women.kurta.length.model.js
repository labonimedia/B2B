const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const WomenKurtaLengthSchema = mongoose.Schema(
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
WomenKurtaLengthSchema.plugin(toJSON);
WomenKurtaLengthSchema.plugin(paginate);

const WomenKurtaLength = mongoose.model('WomenKurtaLength', WomenKurtaLengthSchema);

module.exports = WomenKurtaLength;
