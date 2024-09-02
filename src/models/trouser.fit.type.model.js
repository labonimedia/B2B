const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const trouserFitTypeSchema = mongoose.Schema(
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
trouserFitTypeSchema.plugin(toJSON);
trouserFitTypeSchema.plugin(paginate);

const TrouserFitType = mongoose.model('TrouserFitType', trouserFitTypeSchema);

module.exports = TrouserFitType;
