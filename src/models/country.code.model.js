const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dial_code: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
  }
);
// add plugin that converts mongoose to json
countrySchema.plugin(toJSON);
countrySchema.plugin(paginate);

const Country = mongoose.model('countrie', countrySchema);

module.exports = Country;
