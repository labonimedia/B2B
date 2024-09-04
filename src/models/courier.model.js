const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const courierSchema = mongoose.Schema(
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
courierSchema.plugin(toJSON);
courierSchema.plugin(paginate);

const Courier = mongoose.model('Courier', courierSchema);

module.exports = Courier;
