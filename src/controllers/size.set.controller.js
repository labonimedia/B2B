const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sizeSetService } = require('../services');

const createSizeSet = catchAsync(async (req, res) => {
  const user = await sizeSetService.createSizeSet(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySizeSet = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sizeSetService.querySizeSet(filter, options);
  res.send(result);
});

const getSizeSetById = catchAsync(async (req, res) => {
  const user = await sizeSetService.getSizeSetById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Size Set not found');
  }
  res.send(user);
});

const updateSizeSetById = catchAsync(async (req, res) => {
  const user = await sizeSetService.updateSizeSetById(req.params.id, req.body);
  res.send(user);
});

const deleteSizeSetById = catchAsync(async (req, res) => {
  await sizeSetService.deleteSizeSetById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSizeSet,
  querySizeSet,
  getSizeSetById,
  updateSizeSetById,
  deleteSizeSetById,
};
