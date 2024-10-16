const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const gender = mongoose.Schema(
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
gender.plugin(toJSON);
gender.plugin(paginate);

const Gender = mongoose.model('Gender', gender);

module.exports = Gender;
