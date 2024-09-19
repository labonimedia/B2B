const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const workTypeSchema = mongoose.Schema(
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
workTypeSchema.plugin(toJSON);
workTypeSchema.plugin(paginate);

const WorkType = mongoose.model('WorkType', workTypeSchema);

module.exports = WorkType;
