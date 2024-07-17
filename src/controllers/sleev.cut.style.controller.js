const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sleeveCutStyleService } = require('../services');

const createSleevCutStyle = catchAsync(async (req, res) => {
  const user = await sleeveCutStyleService.createSleevCutStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySleevCutStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sleeveCutStyleService.querySleevCutStyle(filter, options);
  res.send(result);
});

const getSleevCutStyleById = catchAsync(async (req, res) => {
  const user = await sleeveCutStyleService.getSleevCutStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSleevCutStyleById = catchAsync(async (req, res) => {
  const user = await sleeveCutStyleService.updateSleevCutStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteSleevCutStyleById = catchAsync(async (req, res) => {
  await sleeveCutStyleService.deleteSleevCutStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSleevCutStyle,
  querySleevCutStyle,
  getSleevCutStyleById,
  updateSleevCutStyleById,
  deleteSleevCutStyleById,
};
