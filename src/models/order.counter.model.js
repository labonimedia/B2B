const mongoose = require('mongoose');

const orderCounterSchema = new mongoose.Schema({
  wholesalerEmail: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 1,
  },
}, {
  timestamps: true,
});

// Create a unique compound index on wholesalerEmail and year
orderCounterSchema.index({ wholesalerEmail: 1, year: 1 }, { unique: true });

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema);

module.exports = OrderCounter;
