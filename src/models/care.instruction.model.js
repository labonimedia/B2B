const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const careInstructionSchema = mongoose.Schema(
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
careInstructionSchema.plugin(toJSON);
careInstructionSchema.plugin(paginate);

const CareInstruction = mongoose.model('CareInstruction', careInstructionSchema);

module.exports = CareInstruction;
