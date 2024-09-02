const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const trouserPocketSchema = mongoose.Schema(
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
trouserPocketSchema.plugin(toJSON);
trouserPocketSchema.plugin(paginate);

const TrouserPocket = mongoose.model('TrouserPocket', trouserPocketSchema);

module.exports = TrouserPocket;
