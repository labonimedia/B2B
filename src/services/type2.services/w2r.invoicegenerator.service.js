const { W2RInvoiceCounter } = require('../../models');

const getNextW2RInvoiceNumber = async (wholesalerEmail) => {
  const counter = await W2RInvoiceCounter.findOneAndUpdate(
    { wholesalerEmail },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq.toString(); // "1", "2", "3"...
};

module.exports = {
  getNextW2RInvoiceNumber,
};
