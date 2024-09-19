const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { backStyleService } = require('../services');

const createBackStyle = catchAsync(async (req, res) => {
  const user = await backStyleService.createBackStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBackStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await backStyleService.queryBackStyle(filter, options);
  res.send(result);
});

const getBackStyleById = catchAsync(async (req, res) => {
  const user = await backStyleService.getBackStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateBackStyleById = catchAsync(async (req, res) => {
  const user = await backStyleService.updateBackStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteBackStyleById = catchAsync(async (req, res) => {
  await backStyleService.deleteBackStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBackStyle,
  queryBackStyle,
  getBackStyleById,
  updateBackStyleById,
  deleteBackStyleById,
};
