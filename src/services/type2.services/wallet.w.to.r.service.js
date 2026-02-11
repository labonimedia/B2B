const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { W2RWallet } = require('../../models');

/* ---------- CREATE WALLET ---------- */
const createWallet = async (walletBody) => {
  const { wholesalerEmail, retailerEmail } = walletBody;

  if (!wholesalerEmail || !retailerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'wholesalerEmail and retailerEmail are required');
  }

  const existing = await W2RWallet.findOne({
    wholesalerEmail,
    retailerEmail,
  });

  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet already exists for this pair');
  }

  return W2RWallet.create({
    wholesalerEmail,
    retailerEmail,
    currency: walletBody.currency || 'INR',
  });
};

/* ---------- QUERY ---------- */
const queryWallets = async (filter, options) => {
  if (filter.isActive === undefined) {
    filter.isActive = true;
  }
  return W2RWallet.paginate(filter, options);
};

const getWalletById = async (id) => {
  return W2RWallet.findById(id);
};

const getWalletByPair = async (wholesalerEmail, retailerEmail) => {
  return W2RWallet.findOne({ wholesalerEmail, retailerEmail });
};

/* ---------- ADD CREDIT ---------- */
const addCredit = async (body) => {
  const { wholesalerEmail, retailerEmail, amount, creditNoteNumber, creditInvoiceNumber, description } = body;

  if (!wholesalerEmail || !retailerEmail || !amount)
    throw new ApiError(httpStatus.BAD_REQUEST, 'wholesalerEmail, retailerEmail and amount are required');

  if (amount <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 0');

  let wallet = await getWalletByPair(wholesalerEmail, retailerEmail);

  if (!wallet) {
    wallet = await W2RWallet.create({
      wholesalerEmail,
      retailerEmail,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
      currency: 'INR',
    });
  }

  const newBalance = wallet.balance + amount;

  wallet.transactions.push({
    type: 'credit',
    amount,
    balanceAfter: newBalance,
    creditNoteNumber: creditNoteNumber || null,
    creditInvoiceNumber: creditInvoiceNumber || null,
    debitInvoiceNumber: null,
    description: description || `Credit of ₹${amount}`,
    createdAt: new Date(),
  });

  wallet.balance = newBalance;
  wallet.totalCredited += amount;

  await wallet.save();
  return wallet;
};

/* ---------- ADD DEBIT ---------- */
const addDebit = async (body) => {
  const { wholesalerEmail, retailerEmail, amount, debitInvoiceNumber, description } = body;

  if (!wholesalerEmail || !retailerEmail || !amount)
    throw new ApiError(httpStatus.BAD_REQUEST, 'wholesalerEmail, retailerEmail and amount are required');

  if (amount <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 0');

  const wallet = await getWalletByPair(wholesalerEmail, retailerEmail);

  if (!wallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');

  if (wallet.balance < amount) throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');

  const newBalance = wallet.balance - amount;

  wallet.transactions.push({
    type: 'debit',
    amount,
    balanceAfter: newBalance,
    debitInvoiceNumber: debitInvoiceNumber || null,
    description: description || `₹${amount} debited against Invoice #${debitInvoiceNumber}`,
    createdAt: new Date(),
  });

  wallet.balance = newBalance;
  wallet.totalDebited += amount;

  await wallet.save();
  return wallet;
};

/* ---------- UPDATE ---------- */
const updateWallet = async (walletId, updateBody) => {
  const wallet = await getWalletById(walletId);
  if (!wallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');

  const blockedFields = ['balance', 'totalCredited', 'totalDebited', 'transactions'];

  blockedFields.forEach((field) => {
    if (updateBody[field] !== undefined) delete updateBody[field];
  });

  Object.assign(wallet, updateBody);
  await wallet.save();
  return wallet;
};

/* ---------- SOFT DELETE ---------- */
const deleteWallet = async (walletId) => {
  const wallet = await getWalletById(walletId);
  if (!wallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');

  wallet.isActive = false;
  await wallet.save();
};

/* ---------- DEBIT BY WALLET ID ---------- */
const debitWalletById = async (walletId, body) => {
  const { amount, debitInvoiceNumber, description } = body;

  if (!amount || amount <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid amount');

  if (!debitInvoiceNumber) throw new ApiError(httpStatus.BAD_REQUEST, 'debitInvoiceNumber is required');

  const wallet = await W2RWallet.findById(walletId);

  if (!wallet || wallet.isActive === false) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');

  if (wallet.balance < amount) throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');

  const newBalance = wallet.balance - amount;

  wallet.transactions.push({
    type: 'debit',
    amount,
    balanceAfter: newBalance,
    debitInvoiceNumber,
    description: description || `₹${amount} debited against Invoice #${debitInvoiceNumber}`,
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
  addDebit,
  updateWallet,
  deleteWallet,
  debitWalletById,
};
