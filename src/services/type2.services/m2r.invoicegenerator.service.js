const { M2RInvoiceCounter } = require('../../models');

const getNextM2RInvoiceNumber = async (manufacturerEmail) => {
  const counter = await M2RInvoiceCounter.findOneAndUpdate(
    { manufacturerEmail },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq.toString(); // "1", "2", "3"...
};

module.exports = {
  getNextM2RInvoiceNumber,
};
