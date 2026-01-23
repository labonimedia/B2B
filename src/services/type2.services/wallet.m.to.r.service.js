const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { MtoRWallet } = require('../../models');

const createWallet = async (walletBody) => {
  const { manufacturerEmail, retailerEmail } = walletBody;

  if (!manufacturerEmail || !retailerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and retailerEmail are required');
  }

  const existing = await MtoRWallet.findOne({ manufacturerEmail, retailerEmail });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet already exists for this pair');
  }

  const wallet = await MtoRWallet.create({
    manufacturerEmail,
    retailerEmail,
    currency: walletBody.currency || 'INR',
  });

  return wallet;
};

const queryWallets = async (filter, options) => {
  // default: only active wallets
  if (filter.isActive === undefined) {
    filter.isActive = true;
  }
  const wallets = await MtoRWallet.paginate(filter, options);
  return wallets;
};

const getWalletById = async (id) => {
  return MtoRWallet.findById(id);
};

const getWalletByPair = async (manufacturerEmail, retailerEmail) => {
  return MtoRWallet.findOne({ manufacturerEmail, retailerEmail });
};

const addCredit = async (body) => {
  const { manufacturerEmail, retailerEmail, amount, creditNoteNumber, creditInvoiceNumber, description } = body;

  if (!manufacturerEmail || !retailerEmail || !amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail, retailerEmail and amount are required');
  }

  if (amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 0');
  }

  // Find or create wallet
  let wallet = await getWalletByPair(manufacturerEmail, retailerEmail);
  if (!wallet) {
    wallet = await MtoRWallet.create({
      manufacturerEmail,
      retailerEmail,
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

const addDebit = async (body) => {
  const { manufacturerEmail, retailerEmail, amount, debitInvoiceNumber, description } = body;

  if (!manufacturerEmail || !retailerEmail || !amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail, retailerEmail and amount are required');
  }

  if (amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 0');
  }

  const wallet = await getWalletByPair(manufacturerEmail, retailerEmail);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found for this pair');
  }

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
    debitInvoiceNumber: debitInvoiceNumber || null,
    description: description || `Debit of ₹${amount}`,
    createdAt: new Date(),
  };

  wallet.transactions.push(transaction);
  wallet.balance = newBalance;
  wallet.totalDebited += amount;

  await wallet.save();
  return wallet;
};

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

const deleteWallet = async (walletId) => {
  const wallet = await getWalletById(walletId);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  wallet.isActive = false;
  await wallet.save();
};

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

/**
 * Debit amount from wallet by wallet _id (used in invoice)
 * @param {String} walletId
 * @param {Object} body
 * body = { amount, debitInvoiceNumber, description? }
 */
const debitWalletById = async (walletId, body) => {
  const { amount, debitInvoiceNumber, description } = body;

  if (!amount || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'amount' must be a positive number");
  }

  if (!debitInvoiceNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'debitInvoiceNumber' is required");
  }

  const wallet = await MtoRWallet.findById(walletId);
  if (!wallet || wallet.isActive === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  recomputeWalletNumbers(wallet);

  // 2️⃣ Check sufficient balance
  if (wallet.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance to debit this amount');
  }

  const newBalance = wallet.balance - amount;

  // 3️⃣ Build description (nice grammar)
  let finalDescription = description || `₹${amount} debited against Invoice #${debitInvoiceNumber}`;

  // 4️⃣ Create debit transaction
  const transaction = {
    type: 'debit',
    amount,
    balanceAfter: newBalance,
    creditNoteNumber: null,
    creditInvoiceNumber: null,
    debitInvoiceNumber,
    description: finalDescription,
    createdAt: new Date(),
  };

  // 5️⃣ Push transaction and update wallet fields
  wallet.transactions.push(transaction);
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
