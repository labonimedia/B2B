const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const m2wInvoiceCounterSchema = new mongoose.Schema({
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

m2wInvoiceCounterSchema.plugin(toJSON);
m2wInvoiceCounterSchema.plugin(paginate);

const M2WInvoiceCounter = mongoose.model('M2WInvoiceCounter', m2wInvoiceCounterSchema);

module.exports = M2WInvoiceCounter;
