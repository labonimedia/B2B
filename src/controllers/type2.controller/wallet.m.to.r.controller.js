const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { mtoRWalletService } = require('../../services');

// ----------------------------------------------
// Create Wallet (manufacturer + retailer pair)
// ----------------------------------------------
const createWallet = catchAsync(async (req, res) => {
  const wallet = await mtoRWalletService.createWallet(req.body);
  res.status(httpStatus.CREATED).send(wallet);
});

// ----------------------------------------------
// Query Wallets
// ----------------------------------------------
const queryWallets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'retailerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mtoRWalletService.queryWallets(filter, options);
  res.send(result);
});

// ----------------------------------------------
// Get wallet by ID
// ----------------------------------------------
const getWalletById = catchAsync(async (req, res) => {
  const wallet = await mtoRWalletService.getWalletById(req.params.id);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }
  res.send(wallet);
});

// ----------------------------------------------
// Add Credit Transaction
// ----------------------------------------------
const addCredit = catchAsync(async (req, res) => {
  const wallet = await mtoRWalletService.addCredit(req.body);
  res.status(httpStatus.OK).send(wallet);
});

// ----------------------------------------------
// Add Debit Transaction
// ----------------------------------------------
const addDebit = catchAsync(async (req, res) => {
  const wallet = await mtoRWalletService.addDebit(req.body);
  res.status(httpStatus.OK).send(wallet);
});

// ----------------------------------------------
// Update Wallet (if needed)
// ----------------------------------------------
const updateWallet = catchAsync(async (req, res) => {
  const wallet = await mtoRWalletService.updateWallet(req.params.id, req.body);
  res.send(wallet);
});

// ----------------------------------------------
// Delete Wallet (soft delete or hard delete)
// ----------------------------------------------
const deleteWallet = catchAsync(async (req, res) => {
  await mtoRWalletService.deleteWallet(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});
const debitWalletById = catchAsync(async (req, res) => {
  const wallet = await mtoRWalletService.debitWalletById(req.params.walletId, req.body);
  res.send(wallet);
});

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
