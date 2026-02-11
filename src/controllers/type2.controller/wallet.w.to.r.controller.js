const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { w2rWalletService } = require('../../services');

const createWallet = catchAsync(async (req, res) => {
  const wallet = await w2rWalletService.createWallet(req.body);
  res.status(httpStatus.CREATED).send(wallet);
});

const queryWallets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['wholesalerEmail', 'retailerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await w2rWalletService.queryWallets(filter, options);
  res.send(result);
});

const getWalletById = catchAsync(async (req, res) => {
  const wallet = await w2rWalletService.getWalletById(req.params.id);
  if (!wallet)
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  res.send(wallet);
});

const updateWallet = catchAsync(async (req, res) => {
  const wallet = await w2rWalletService.updateWallet(
    req.params.id,
    req.body
  );
  res.send(wallet);
});

const deleteWallet = catchAsync(async (req, res) => {
  await w2rWalletService.deleteWallet(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const debitWalletById = catchAsync(async (req, res) => {
  const wallet = await w2rWalletService.debitWalletById(
    req.params.walletId,
    req.body
  );
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
