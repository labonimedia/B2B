const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { MtoWWallet } = require('../../models');

/* ---------- Create Wallet ---------- */

const createWallet = async (body) => {
  const { manufacturerEmail, wholesalerEmail } = body;

  if (!manufacturerEmail || !wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and wholesalerEmail are required');
  }

  const existing = await MtoWWallet.findOne({ manufacturerEmail, wholesalerEmail });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet already exists for this pair');
  }

  return MtoWWallet.create({
    manufacturerEmail,
    wholesalerEmail,
    currency: body.currency || 'INR',
  });
};

/* ---------- Query ---------- */

const queryWallets = async (filter, options) => {
  if (filter.isActive === undefined) {
    filter.isActive = true;
  }
  return MtoWWallet.paginate(filter, options);
};

/* ---------- Get by ID ---------- */

const getWalletById = async (id) => {
  return MtoWWallet.findById(id);
};

/* ---------- Get by Pair ---------- */

const getWalletByPair = async (manufacturerEmail, wholesalerEmail) => {
  return MtoWWallet.findOne({ manufacturerEmail, wholesalerEmail });
};

/* ---------- Add Credit ---------- */

const addCredit = async (body) => {
  const { manufacturerEmail, wholesalerEmail, amount, creditNoteNumber, creditInvoiceNumber, description } = body;

  if (!manufacturerEmail || !wholesalerEmail || !amount || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credit request');
  }

  let wallet = await getWalletByPair(manufacturerEmail, wholesalerEmail);

  if (!wallet) {
    wallet = await MtoWWallet.create({
      manufacturerEmail,
      wholesalerEmail,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
    });
  }

  const newBalance = wallet.balance + amount;

  wallet.transactions.push({
    type: 'credit',
    amount,
    balanceAfter: newBalance,
    creditNoteNumber,
    creditInvoiceNumber,
    description: description || `Credit of ₹${amount}`,
    createdAt: new Date(),
  });

  wallet.balance = newBalance;
  wallet.totalCredited += amount;

  await wallet.save();
  return wallet;
};

/* ---------- Debit Wallet ---------- */

const debitWalletById = async (walletId, body) => {
  const { amount, debitInvoiceNumber, description } = body;

  if (!amount || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid debit amount');
  }

  const wallet = await MtoWWallet.findById(walletId);

  if (!wallet || wallet.isActive === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  if (wallet.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  const newBalance = wallet.balance - amount;

  wallet.transactions.push({
    type: 'debit',
    amount,
    balanceAfter: newBalance,
    debitInvoiceNumber,
    description: description || `₹${amount} debited`,
    createdAt: new Date(),
  });

  wallet.balance = newBalance;
  wallet.totalDebited += amount;

  await wallet.save();
  return wallet;
};

module.exports = {
  createWallet,
  queryWallets,
  getWalletById,
  addCredit,
  debitWalletById,
};
