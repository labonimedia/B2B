const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { patternService } = require('../services');

const createPattern = catchAsync(async (req, res) => {
  const user = await patternService.createPattern(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryPattern = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await patternService.queryPattern(filter, options);
  res.send(result);
});

const getPatternById = catchAsync(async (req, res) => {
  const user = await patternService.getPatternById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pattern not found');
  }
  res.send(user);
});

const updatePatternById = catchAsync(async (req, res) => {
  const user = await patternService.updatePatternById(req.params.id, req.body);
  res.send(user);
});

const deletePatternById = catchAsync(async (req, res) => {
  await patternService.deletePatternById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPattern,
  queryPattern,
  getPatternById,
  updatePatternById,
  deletePatternById,
};
