const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const embellishmentFeatureSchema = mongoose.Schema(
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
embellishmentFeatureSchema.plugin(toJSON);
embellishmentFeatureSchema.plugin(paginate);

const EmbellishmentFeature = mongoose.model('EmbellishmentFeature', embellishmentFeatureSchema);

module.exports = EmbellishmentFeature;
