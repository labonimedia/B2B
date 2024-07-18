const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { collarStyleService } = require('../services');

const createCollarStyle = catchAsync(async (req, res) => {
  const user = await collarStyleService.createCollarStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCollarStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await collarStyleService.queryCollarStyle(filter, options);
  res.send(result);
});

const getCollarStyleById = catchAsync(async (req, res) => {
  const user = await collarStyleService.getCollarStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CollarStyle not found');
  }
  res.send(user);
});

const updateCollarStyleById = catchAsync(async (req, res) => {
  const user = await collarStyleService.updateCollarStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteCollarStyleById = catchAsync(async (req, res) => {
  await collarStyleService.deleteCollarStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCollarStyle,
  queryCollarStyle,
  getCollarStyleById,
  updateCollarStyleById,
  deleteCollarStyleById,
};
