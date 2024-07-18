const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const seasonsSchema = mongoose.Schema(
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
seasonsSchema.plugin(toJSON);
seasonsSchema.plugin(paginate);

const Season = mongoose.model('Season', seasonsSchema);

module.exports = Season;
