const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const lengthWomenDresSchema = mongoose.Schema(
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
lengthWomenDresSchema.plugin(toJSON);
lengthWomenDresSchema.plugin(paginate);

const LengthWomenDress = mongoose.model('LengthWomenDress', lengthWomenDresSchema);

module.exports = LengthWomenDress;
