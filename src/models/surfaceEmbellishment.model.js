const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const surfaceEmbellishmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

surfaceEmbellishmentSchema.plugin(toJSON);
surfaceEmbellishmentSchema.plugin(paginate);

const SurfaceEmbellishment = mongoose.model('SurfaceEmbellishment', surfaceEmbellishmentSchema);

module.exports = SurfaceEmbellishment;
