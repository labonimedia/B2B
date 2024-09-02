const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const trouserStyleSchema = mongoose.Schema(
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
trouserStyleSchema.plugin(toJSON);
trouserStyleSchema.plugin(paginate);

const TrouserStyle = mongoose.model('TrouserStyle', trouserStyleSchema);

module.exports = TrouserStyle;
