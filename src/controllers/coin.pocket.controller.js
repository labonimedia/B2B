const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { coinPocketsService } = require('../services');

const createCoinPockets = catchAsync(async (req, res) => {
  const user = await coinPocketsService.createCoinPockets(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCoinPockets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await coinPocketsService.queryCoinPockets(filter, options);
  res.send(result);
});

const getCoinPocketsById = catchAsync(async (req, res) => {
  const user = await coinPocketsService.getCoinPocketsById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CoinPockets not found');
  }
  res.send(user);
});

const updateCoinPocketsById = catchAsync(async (req, res) => {
  const user = await coinPocketsService.updateCoinPocketsById(req.params.id, req.body);
  res.send(user);
});

const deleteCoinPocketsById = catchAsync(async (req, res) => {
  await coinPocketsService.deleteCoinPocketsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCoinPockets,
  queryCoinPockets,
  getCoinPocketsById,
  updateCoinPocketsById,
  deleteCoinPocketsById,
};
