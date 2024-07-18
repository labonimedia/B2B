const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const occasionSchema = mongoose.Schema(
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
occasionSchema.plugin(toJSON);
occasionSchema.plugin(paginate);

const Occasion = mongoose.model('Occasion', occasionSchema);

module.exports = Occasion;
