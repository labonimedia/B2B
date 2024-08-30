const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['retailer', 'wholesaler', 'manufacturer'],
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;
