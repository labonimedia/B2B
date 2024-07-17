const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sleeveLengthService } = require('../services');

const createSleeveLength = catchAsync(async (req, res) => {
  const user = await sleeveLengthService.createSleeveLength(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySleeveLength = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sleeveLengthService.querySleeveLength(filter, options);
  res.send(result);
});

const getSleeveLengthById = catchAsync(async (req, res) => {
  const user = await sleeveLengthService.getSleeveLengthById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSleeveLengthById = catchAsync(async (req, res) => {
  const user = await sleeveLengthService.updateSleeveLengthById(req.params.id, req.body);
  res.send(user);
});

const deleteSleeveLengthById = catchAsync(async (req, res) => {
  await sleeveLengthService.deleteSleeveLengthById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSleeveLength,
  querySleeveLength,
  getSleeveLengthById,
  updateSleeveLengthById,
  deleteSleeveLengthById,
};
