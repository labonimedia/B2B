const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { MtoWWallet } = require('../../models');

/* ---------- Create Wallet ---------- */

const createWallet = async (walletBody) => {
  const { manufacturerEmail, wholesalerEmail } = walletBody;

  if (!manufacturerEmail || !wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and wholesalerEmail are required');
  }

  const existing = await MtoWWallet.findOne({ manufacturerEmail, wholesalerEmail });

  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet already exists for this pair');
  }

  const wallet = await MtoWWallet.create({
    manufacturerEmail,
    wholesalerEmail,
    currency: walletBody.currency || 'INR',
  });

  return wallet;
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

  if (!manufacturerEmail || !wholesalerEmail || !amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail, wholesalerEmail and amount are required');
  }

  if (amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 0');
  }

  let wallet = await getWalletByPair(manufacturerEmail, wholesalerEmail);

  if (!wallet) {
    wallet = await MtoWWallet.create({
      manufacturerEmail,
      wholesalerEmail,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
      currency: 'INR',
    });
  }

  const newBalance = wallet.balance + amount;

  const transaction = {
    type: 'credit',
    amount,
    balanceAfter: newBalance,
    creditNoteNumber: creditNoteNumber || null,
    creditInvoiceNumber: creditInvoiceNumber || null,
    debitInvoiceNumber: null,
    description: description || `Credit of ₹${amount}`,
    createdAt: new Date(),
  };

  wallet.transactions.push(transaction);
  wallet.balance = newBalance;
  wallet.totalCredited += amount;

  await wallet.save();
  return wallet;
};

/* ---------- Recompute (IMPORTANT FIX) ---------- */

const recomputeWalletNumbers = (wallet) => {
  let balance = 0;
  let totalCredited = 0;
  let totalDebited = 0;

  if (Array.isArray(wallet.transactions)) {
    wallet.transactions.forEach((tx) => {
      if (tx.type === 'credit') {
        balance += tx.amount;
        totalCredited += tx.amount;
      } else if (tx.type === 'debit') {
        balance -= tx.amount;
        totalDebited += tx.amount;
      }
    });
  }

  wallet.balance = balance;
  wallet.totalCredited = totalCredited;
  wallet.totalDebited = totalDebited;
};

/* ---------- Debit Wallet (BEST VERSION) ---------- */

const debitWalletById = async (walletId, body) => {
  const { amount, debitInvoiceNumber, description } = body;

  if (!amount || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'amount' must be a positive number");
  }

  if (!debitInvoiceNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'debitInvoiceNumber' is required");
  }

  const wallet = await MtoWWallet.findById(walletId);

  if (!wallet || wallet.isActive === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  // 🔥 IMPORTANT: recompute before debit
  recomputeWalletNumbers(wallet);

  if (wallet.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');
  }

  const newBalance = wallet.balance - amount;

  const transaction = {
    type: 'debit',
    amount,
    balanceAfter: newBalance,
    creditNoteNumber: null,
    creditInvoiceNumber: null,
    debitInvoiceNumber,
    description: description || `₹${amount} debited against Invoice #${debitInvoiceNumber}`,
    createdAt: new Date(),
  };

  wallet.transactions.push(transaction);
  wallet.balance = newBalance;
  wallet.totalDebited += amount;

  await wallet.save();
  return wallet;
};

/* ---------- Update ---------- */

const updateWallet = async (walletId, updateBody) => {
  const wallet = await getWalletById(walletId);

  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  const blockedFields = ['balance', 'totalCredited', 'totalDebited', 'transactions'];

  blockedFields.forEach((field) => {
    if (updateBody[field] !== undefined) {
      delete updateBody[field];
    }
  });

  Object.assign(wallet, updateBody);
  await wallet.save();

  return wallet;
};

/* ---------- Delete (Soft Delete) ---------- */

const deleteWallet = async (walletId) => {
  const wallet = await getWalletById(walletId);

  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  wallet.isActive = false;
  await wallet.save();
};

module.exports = {
  createWallet,
  queryWallets,
  getWalletById,
  addCredit,
  debitWalletById,
  updateWallet,
  deleteWallet,
};
