const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { SocksSizeService } = require('../services');

const createSocksSize = catchAsync(async (req, res) => {
  const user = await SocksSizeService.createSocksSize(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySocksSize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await SocksSizeService.querySocksSize(filter, options);
  res.send(result);
});

const getSocksSizeById = catchAsync(async (req, res) => {
  const user = await SocksSizeService.getSocksSizeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSocksSizeById = catchAsync(async (req, res) => {
  const user = await SocksSizeService.updateSocksSizeById(req.params.id, req.body);
  res.send(user);
});

const deleteSocksSizeById = catchAsync(async (req, res) => {
  await SocksSizeService.deleteSocksSizeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSocksSize,
  querySocksSize,
  getSocksSizeById,
  updateSocksSizeById,
  deleteSocksSizeById,
};
