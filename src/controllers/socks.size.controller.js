const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { socksSizeService } = require('../services');

const createSocksSize = catchAsync(async (req, res) => {
  const user = await socksSizeService.createSocksSize(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySocksSize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await socksSizeService.querySocksSize(filter, options);
  res.send(result);
});

const getSocksSizeById = catchAsync(async (req, res) => {
  const user = await socksSizeService.getSocksSizeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSocksSizeById = catchAsync(async (req, res) => {
  const user = await socksSizeService.updateSocksSizeById(req.params.id, req.body);
  res.send(user);
});

const deleteSocksSizeById = catchAsync(async (req, res) => {
  await socksSizeService.deleteSocksSizeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSocksSize,
  querySocksSize,
  getSocksSizeById,
  updateSocksSizeById,
  deleteSocksSizeById,
};
