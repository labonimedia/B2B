const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const { m2wWalletService } = require('../../services');

const createWallet = catchAsync(async (req, res) => {
  const wallet = await m2wWalletService.createWallet(req.body);
  res.status(httpStatus.CREATED).send(wallet);
});

const queryWallets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'wholesalerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await m2wWalletService.queryWallets(filter, options);
  res.send(result);
});

const getWalletById = catchAsync(async (req, res) => {
  const wallet = await m2wWalletService.getWalletById(req.params.id);

  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  res.send(wallet);
});

const updateWallet = catchAsync(async (req, res) => {
  const wallet = await m2wWalletService.updateWallet(req.params.id, req.body);
  res.send(wallet);
});

const deleteWallet = catchAsync(async (req, res) => {
  await m2wWalletService.deleteWallet(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const debitWalletById = catchAsync(async (req, res) => {
  const wallet = await m2wWalletService.debitWalletById(req.params.walletId, req.body);
  res.send(wallet);
});

module.exports = {
  createWallet,
  queryWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
  debitWalletById,
};