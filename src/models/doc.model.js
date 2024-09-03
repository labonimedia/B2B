const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const manufactureDocSchema = mongoose.Schema(
  {
    file: {
      type: String,
    },
    fileName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
manufactureDocSchema.plugin(toJSON);
manufactureDocSchema.plugin(paginate);

const ManufactureDoc = mongoose.model('ManufactureDoc', manufactureDocSchema);

module.exports = ManufactureDoc;
