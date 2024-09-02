const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const noOfPocketsSchema = mongoose.Schema(
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
noOfPocketsSchema.plugin(toJSON);
noOfPocketsSchema.plugin(paginate);

const NoOfPockets = mongoose.model('NoOfPockets', noOfPocketsSchema);

module.exports = NoOfPockets;
