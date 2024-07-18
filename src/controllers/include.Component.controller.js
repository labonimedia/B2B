const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { includeComponentService } = require('../services');

const createIncludeComponent = catchAsync(async (req, res) => {
  const user = await includeComponentService.createIncludeComponent(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryIncludeComponent = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await includeComponentService.queryIncludeComponent(filter, options);
  res.send(result);
});

const getIncludeComponentById = catchAsync(async (req, res) => {
  const user = await includeComponentService.getIncludeComponentById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncludeComponent not found');
  }
  res.send(user);
});

const updateIncludeComponentById = catchAsync(async (req, res) => {
  const user = await includeComponentService.updateIncludeComponentById(req.params.id, req.body);
  res.send(user);
});

const deleteIncludeComponentById = catchAsync(async (req, res) => {
  await includeComponentService.deleteIncludeComponentById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createIncludeComponent,
  queryIncludeComponent,
  getIncludeComponentById,
  updateIncludeComponentById,
  deleteIncludeComponentById,
};
