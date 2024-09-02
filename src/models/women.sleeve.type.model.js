const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const womenSleeveTypeSchema = mongoose.Schema(
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
womenSleeveTypeSchema.plugin(toJSON);
womenSleeveTypeSchema.plugin(paginate);

const WomenSleeveType = mongoose.model('WomenSleeveType', womenSleeveTypeSchema);

module.exports = WomenSleeveType;
