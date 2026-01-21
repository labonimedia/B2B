const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const m2rInvoiceCounterSchema = new mongoose.Schema({
  manufacturerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

m2rInvoiceCounterSchema.plugin(toJSON);
m2rInvoiceCounterSchema.plugin(paginate);

const M2RInvoiceCounter = mongoose.model('M2RInvoiceCounter', m2rInvoiceCounterSchema);

module.exports = M2RInvoiceCounter;
