// const httpStatus = require('http-status');
// const ApiError = require('../../utils/ApiError');
// const { MtoWCreditNote, MtoWWallet } = require('../../models');

// /* ---------- Create Credit Note ---------- */

// const createM2WCreditNote = async (reqBody) => {
//   const { manufacturerEmail, wholesalerEmail, totalCreditAmount } = reqBody;

//   if (!manufacturerEmail || !wholesalerEmail) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and wholesalerEmail are required');
//   }

//   if (!totalCreditAmount || totalCreditAmount <= 0) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'totalCreditAmount must be greater than 0');
//   }

//   // 🔹 Generate creditNoteNumber per manufacturer
//   const lastNote = await MtoWCreditNote.findOne({ manufacturerEmail }).sort({ creditNoteNumber: -1 }).lean();

//   const nextNumber = lastNote?.creditNoteNumber ? lastNote.creditNoteNumber + 1 : 1;

//   reqBody.creditNoteNumber = nextNumber;

//   // 🔹 Create credit note
//   const creditNote = await MtoWCreditNote.create(reqBody);

//   // 🔹 Update Wallet
//   let wallet = await MtoWWallet.findOne({
//     manufacturerEmail,
//     wholesalerEmail,
//   });

//   if (!wallet) {
//     wallet = await MtoWWallet.create({
//       manufacturerEmail,
//       wholesalerEmail,
//       balance: 0,
//       totalCredited: 0,
//       totalDebited: 0,
//     });
//   }

//   const newBalance = wallet.balance + totalCreditAmount;

//   wallet.transactions.push({
//     type: 'credit',
//     amount: totalCreditAmount,
//     balanceAfter: newBalance,
//     creditNoteNumber: nextNumber,
//     creditInvoiceNumber: creditNote.invoiceNumber,
//     description: `Credit Note #${nextNumber} generated`,
//     createdAt: new Date(),
//   });

//   wallet.balance = newBalance;
//   wallet.totalCredited += totalCreditAmount;

//   await wallet.save();

//   return creditNote;
// };

// /* ---------- Query ---------- */

// const queryM2WCreditNotes = async (filter, options) => {
//   return MtoWCreditNote.paginate(filter, options);
// };

// /* ---------- Get by ID ---------- */

// const getM2WCreditNoteById = async (id) => {
//   return MtoWCreditNote.findById(id);
// };

// /* ---------- Delete ---------- */

// const deleteM2WCreditNoteById = async (id) => {
//   const note = await getM2WCreditNoteById(id);
//   if (!note) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');
//   }
//   note.isDeleted = true;
//   await note.save();
// };

// module.exports = {
//   createM2WCreditNote,
//   queryM2WCreditNotes,
//   getM2WCreditNoteById,
//   deleteM2WCreditNoteById,
// };

const httpStatus = require('http-status');
const { MtoWCreditNote, MtoWWallet, Manufacture, Wholesaler } = require('../../models');
const ApiError = require('../../utils/ApiError');

/* ---------- Bulk Upload ---------- */

const bulkUploadM2WCreditNote = async (dataArray) => {
  const results = await MtoWCreditNote.insertMany(dataArray, { ordered: false });
  return results;
};

/* ---------- Create Credit Note ---------- */

const createM2WCreditNote = async (reqBody) => {
  const { manufacturerEmail, wholesalerEmail, totalCreditAmount } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'manufacturerEmail' is required");
  }

  if (!wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'wholesalerEmail' is required");
  }

  if (!totalCreditAmount || totalCreditAmount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'totalCreditAmount' must be positive");
  }

  /* ---------- Generate Credit Note Number ---------- */

  const lastCreditNote = await MtoWCreditNote.findOne({ manufacturerEmail })
    .sort({ creditNoteNumber: -1 })
    .lean();

  let nextNumber = 1;

  if (lastCreditNote?.creditNoteNumber) {
    nextNumber = lastCreditNote.creditNoteNumber + 1;
  }

  reqBody.creditNoteNumber = nextNumber;

  const creditNote = await MtoWCreditNote.create(reqBody);

  /* ---------- Wallet ---------- */

  let wallet = await MtoWWallet.findOne({
    manufacturerEmail,
    wholesalerEmail,
  });

  if (!wallet) {
    wallet = await MtoWWallet.create({
      manufacturerEmail,
      wholesalerEmail,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
      currency: 'INR',
      transactions: [],
    });
  } else {

    /* ---------- Recalculate wallet ---------- */

    let recomputedBalance = 0;
    let recomputedCredited = 0;
    let recomputedDebited = 0;

    wallet.transactions.forEach((tx) => {
      if (tx.type === 'credit') {
        recomputedBalance += tx.amount;
        recomputedCredited += tx.amount;
      } else {
        recomputedBalance -= tx.amount;
        recomputedDebited += tx.amount;
      }
    });

    wallet.balance = recomputedBalance;
    wallet.totalCredited = recomputedCredited;
    wallet.totalDebited = recomputedDebited;
  }

  const creditAmount = creditNote.totalCreditAmount;
  const newBalance = wallet.balance + creditAmount;

  /* ---------- Description ---------- */

  let description = `Credit Note #${creditNote.creditNoteNumber} generated`;

  if (creditNote.invoiceNumber) {
    description = `Credit Note #${creditNote.creditNoteNumber} generated against Invoice #${creditNote.invoiceNumber}`;
  }

  /* ---------- Transaction ---------- */

  const transaction = {
    type: 'credit',
    amount: creditAmount,
    balanceAfter: newBalance,
    creditNoteNumber: creditNote.creditNoteNumber,
    creditInvoiceNumber: creditNote.invoiceNumber || null,
    debitInvoiceNumber: null,
    description,
    createdAt: new Date(),
  };

  wallet.transactions.push(transaction);

  wallet.balance = newBalance;
  wallet.totalCredited += creditAmount;

  await wallet.save();

  return creditNote;
};

/* ---------- Query ---------- */

const queryM2WCreditNotes = async (filter, options) => {
  return MtoWCreditNote.paginate(filter, options);
};

/* ---------- Group ---------- */

const groupM2WCreditNotes = async (query) => {
  const { wholesalerEmail, manufacturerEmail, used, page = 1, limit = 10 } = query;

  const usedBool = used === 'true';

  const matchStage = wholesalerEmail
    ? { wholesalerEmail, used: usedBool }
    : { manufacturerEmail, used: usedBool };

  const groupByField = wholesalerEmail ? '$manufacturerEmail' : '$wholesalerEmail';

  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: groupByField,
        totalCreditNotes: { $sum: 1 },
        totalCreditAmount: { $sum: '$totalCreditAmount' },
      },
    },
    { $sort: { _id: 1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const grouped = await MtoWCreditNote.aggregate(pipeline);

  return {
    page: Number(page),
    limit: Number(limit),
    data: grouped,
  };
};

/* ---------- Get by ID ---------- */

const getM2WCreditNoteById = async (id) => {
  return MtoWCreditNote.findById(id);
};

/* ---------- Update ---------- */

const updateM2WCreditNoteById = async (id, updateBody) => {
  const creditNote = await getM2WCreditNoteById(id);

  if (!creditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');
  }

  Object.assign(creditNote, updateBody);

  await creditNote.save();

  return creditNote;
};

/* ---------- Delete ---------- */

const deleteM2WCreditNoteById = async (id) => {
  const creditNote = await getM2WCreditNoteById(id);

  if (!creditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');
  }

  await creditNote.remove();
};

/* ---------- Bulk Update ---------- */

const bulkUpdateCreditNotes = async (creditNotes) => {
  const ids = creditNotes.map((note) => note.id);

  const bulkOps = creditNotes.map((note) => ({
    updateOne: {
      filter: { _id: note.id },
      update: {
        $set: {
          used: note.used,
          usedInInvoiceId: note.usedInInvoiceId || null,
          usedInInvoiceNumber: note.usedInInvoiceNumber || null,
          usedAt: note.used ? note.usedAt || new Date() : null,
        },
      },
    },
  }));

  await MtoWCreditNote.bulkWrite(bulkOps, { ordered: false });

  return MtoWCreditNote.find({ _id: { $in: ids } });
};

module.exports = {
  bulkUploadM2WCreditNote,
  createM2WCreditNote,
  queryM2WCreditNotes,
  groupM2WCreditNotes,
  getM2WCreditNoteById,
  updateM2WCreditNoteById,
  deleteM2WCreditNoteById,
  bulkUpdateCreditNotes,
};