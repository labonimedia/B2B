const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const w2rInvoiceCounterSchema = new mongoose.Schema({
  wholesalerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

w2rInvoiceCounterSchema.plugin(toJSON);
w2rInvoiceCounterSchema.plugin(paginate);

const W2RInvoiceCounter = mongoose.model('W2RInvoiceCounter', w2rInvoiceCounterSchema);

module.exports = W2RInvoiceCounter;
