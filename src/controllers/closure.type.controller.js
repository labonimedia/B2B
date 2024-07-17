const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { closureTypeService } = require('../services');

const createClosureType = catchAsync(async (req, res) => {
  const user = await closureTypeService.createClosureType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryClosureType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await closureTypeService.queryClosureType(filter, options);
  res.send(result);
});

const getClosureTypeById = catchAsync(async (req, res) => {
  const user = await closureTypeService.getClosureTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateClosureTypeById = catchAsync(async (req, res) => {
  const user = await closureTypeService.updateClosureTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteClosureTypeById = catchAsync(async (req, res) => {
  await closureTypeService.deleteClosureTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClosureType,
  queryClosureType,
  getClosureTypeById,
  updateClosureTypeById,
  deleteClosureTypeById,
};
