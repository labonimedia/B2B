const httpStatus = require('http-status');
const { WtoRCreditNote, Retailer, Wholesaler, W2RWallet } = require('../../models');
const ApiError = require('../../utils/ApiError');

/* ---------- BULK INSERT ---------- */
const bulkUploadW2RCreditNote = async (dataArray) => {
  return WtoRCreditNote.insertMany(dataArray, { ordered: false });
};

/* ---------- CREATE CREDIT NOTE + WALLET UPDATE ---------- */
const createW2RCreditNote = async (reqBody) => {
  const { wholesalerEmail, retailerEmail, totalCreditAmount } = reqBody;

  if (!wholesalerEmail)
    throw new ApiError(httpStatus.BAD_REQUEST, "'wholesalerEmail' is required.");

  if (!retailerEmail)
    throw new ApiError(httpStatus.BAD_REQUEST, "'retailerEmail' is required.");

  if (!totalCreditAmount || totalCreditAmount <= 0)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid totalCreditAmount.");

  // Generate next creditNoteNumber per wholesaler
  const lastNote = await WtoRCreditNote.findOne({ wholesalerEmail })
    .sort({ creditNoteNumber: -1 })
    .lean();

  let nextNumber = 1;
  if (lastNote?.creditNoteNumber)
    nextNumber = lastNote.creditNoteNumber + 1;

  reqBody.creditNoteNumber = nextNumber;

  const creditNote = await WtoRCreditNote.create(reqBody);

  /* ---------- WALLET LOGIC ---------- */

  let wallet = await W2RWallet.findOne({
    wholesalerEmail,
    retailerEmail,
  });

  if (!wallet) {
    wallet = await W2RWallet.create({
      wholesalerEmail,
      retailerEmail,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
      currency: 'INR',
      transactions: [],
    });
  }

  const newBalance = wallet.balance + totalCreditAmount;

  wallet.transactions.push({
    type: 'credit',
    amount: totalCreditAmount,
    balanceAfter: newBalance,
    creditNoteNumber: creditNote.creditNoteNumber,
    creditInvoiceNumber: creditNote.invoiceNumber,
    description: `Credit Note #${creditNote.creditNoteNumber} generated`,
    createdAt: new Date(),
  });

  wallet.balance = newBalance;
  wallet.totalCredited += totalCreditAmount;

  await wallet.save();

  return creditNote;
};

/* ---------- QUERY ---------- */
const queryW2RCreditNote = async (filter, options) => {
  return WtoRCreditNote.paginate(filter, options);
};

/* ---------- GROUP ---------- */
const groupW2RCreditNote = async (query) => {
  const { retailerEmail, wholesalerEmail, used, page = 1, limit = 10 } = query;

  const usedBool = used === "true";

  const matchStage = retailerEmail
    ? { retailerEmail, used: usedBool }
    : { wholesalerEmail, used: usedBool };

  const groupByField = retailerEmail ? "$wholesalerEmail" : "$retailerEmail";

  const skip = (Number(page) - 1) * Number(limit);

  const grouped = await WtoRCreditNote.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupByField,
        totalCreditNotes: { $sum: 1 },
        totalCreditAmount: { $sum: "$totalCreditAmount" },
      },
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  return grouped;
};

/* ---------- CRUD ---------- */
const getW2RCreditNoteById = async (id) => {
  return WtoRCreditNote.findById(id);
};

const updateW2RCreditNoteById = async (id, updateBody) => {
  const note = await getW2RCreditNoteById(id);
  if (!note)
    throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');

  Object.assign(note, updateBody);
  await note.save();
  return note;
};

const deleteW2RCreditNoteById = async (id) => {
  const note = await getW2RCreditNoteById(id);
  if (!note)
    throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');

  await note.remove();
};

const bulkUpdateCreditNotes = async (creditNotes) => {
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

  await WtoRCreditNote.bulkWrite(bulkOps, { ordered: false });

  return WtoRCreditNote.find({
    _id: { $in: creditNotes.map((n) => n.id) },
  });
};

module.exports = {
  createW2RCreditNote,
  queryW2RCreditNote,
  getW2RCreditNoteById,
  updateW2RCreditNoteById,
  deleteW2RCreditNoteById,
  bulkUploadW2RCreditNote,
  groupW2RCreditNote,
  bulkUpdateCreditNotes,
};
