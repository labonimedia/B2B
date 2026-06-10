const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const patchworkDesignSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

patchworkDesignSchema.plugin(toJSON);
patchworkDesignSchema.plugin(paginate);

const PatchworkDesign = mongoose.model('PatchworkDesign', patchworkDesignSchema);

module.exports = PatchworkDesign;
