const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const apparelSilhouetteSchema = mongoose.Schema(
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
apparelSilhouetteSchema.plugin(toJSON);
apparelSilhouetteSchema.plugin(paginate);

const ApparelSilhouette = mongoose.model('ApparelSilhouette', apparelSilhouetteSchema);

module.exports = ApparelSilhouette;
