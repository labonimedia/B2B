const mongoose = require('mongoose');

const challanCounterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Create a unique compound index on wholesalerEmail and year
challanCounterSchema.index({ email: 1 }, { unique: true });

const ChallanCounter = mongoose.model('ChallanCounter', challanCounterSchema);

module.exports = ChallanCounter;
