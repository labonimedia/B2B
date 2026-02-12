const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { MtoWCreditNote, MtoWWallet } = require('../../models');

/* ---------- Create Credit Note ---------- */

const createM2WCreditNote = async (reqBody) => {
  const { manufacturerEmail, wholesalerEmail, totalCreditAmount } = reqBody;

  if (!manufacturerEmail || !wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and wholesalerEmail are required');
  }

  if (!totalCreditAmount || totalCreditAmount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'totalCreditAmount must be greater than 0');
  }

  // 🔹 Generate creditNoteNumber per manufacturer
  const lastNote = await MtoWCreditNote.findOne({ manufacturerEmail }).sort({ creditNoteNumber: -1 }).lean();

  const nextNumber = lastNote?.creditNoteNumber ? lastNote.creditNoteNumber + 1 : 1;

  reqBody.creditNoteNumber = nextNumber;

  // 🔹 Create credit note
  const creditNote = await MtoWCreditNote.create(reqBody);

  // 🔹 Update Wallet
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
    });
  }

  const newBalance = wallet.balance + totalCreditAmount;

  wallet.transactions.push({
    type: 'credit',
    amount: totalCreditAmount,
    balanceAfter: newBalance,
    creditNoteNumber: nextNumber,
    creditInvoiceNumber: creditNote.invoiceNumber,
    description: `Credit Note #${nextNumber} generated`,
    createdAt: new Date(),
  });

  wallet.balance = newBalance;
  wallet.totalCredited += totalCreditAmount;

  await wallet.save();

  return creditNote;
};

/* ---------- Query ---------- */

const queryM2WCreditNotes = async (filter, options) => {
  return MtoWCreditNote.paginate(filter, options);
};

/* ---------- Get by ID ---------- */

const getM2WCreditNoteById = async (id) => {
  return MtoWCreditNote.findById(id);
};

/* ---------- Delete ---------- */

const deleteM2WCreditNoteById = async (id) => {
  const note = await getM2WCreditNoteById(id);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');
  }
  note.isDeleted = true;
  await note.save();
};

module.exports = {
  createM2WCreditNote,
  queryM2WCreditNotes,
  getM2WCreditNoteById,
  deleteM2WCreditNoteById,
};
