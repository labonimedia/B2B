const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const embroideryTypesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

embroideryTypesSchema.plugin(toJSON);
embroideryTypesSchema.plugin(paginate);

const EmbroideryTypes = mongoose.model('EmbroideryTypes', embroideryTypesSchema);

module.exports = EmbroideryTypes;
