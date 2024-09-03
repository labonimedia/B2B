const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { noOfPocketsService } = require('../services');

const createNoOfPockets = catchAsync(async (req, res) => {
  const user = await noOfPocketsService.createNoOfPockets(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryTopType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await noOfPocketsService.queryNoOfPockets(filter, options);
  res.send(result);
});

const getTopTypeById = catchAsync(async (req, res) => {
  const user = await noOfPocketsService.getNoOfPocketsById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TopType not found');
  }
  res.send(user);
});

const updateTopTypeById = catchAsync(async (req, res) => {
  const user = await noOfPocketsService.updateNoOfPocketsById(req.params.id, req.body);
  res.send(user);
});

const deleteTopTypeById = catchAsync(async (req, res) => {
  await noOfPocketsService.deleteNoOfPocketsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNoOfPockets,
  queryTopType,
  getTopTypeById,
  updateTopTypeById,
  deleteTopTypeById,
};
