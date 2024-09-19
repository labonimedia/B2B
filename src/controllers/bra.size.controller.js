const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { braSizeService } = require('../services');

const createBraSize = catchAsync(async (req, res) => {
  const user = await braSizeService.createBraSize(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBraSize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await braSizeService.queryBraSize(filter, options);
  res.send(result);
});

const getBraSizeById = catchAsync(async (req, res) => {
  const user = await braSizeService.getBraSizeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateBraSizeById = catchAsync(async (req, res) => {
  const user = await braSizeService.updateBraSizeById(req.params.id, req.body);
  res.send(user);
});

const deleteBraSizeById = catchAsync(async (req, res) => {
  await braSizeService.deleteBraSizeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBraSize,
  queryBraSize,
  getBraSizeById,
  updateBraSizeById,
  deleteBraSizeById,
};
