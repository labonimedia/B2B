const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ethnicDesignSchema = mongoose.Schema(
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
ethnicDesignSchema.plugin(toJSON);
ethnicDesignSchema.plugin(paginate);

const EthnicDesign = mongoose.model('EthnicDesign', ethnicDesignSchema);

module.exports = EthnicDesign;
