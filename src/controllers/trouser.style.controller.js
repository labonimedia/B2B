const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trouserStyleService } = require('../services');

const createTrouserStyle = catchAsync(async (req, res) => {
  const user = await trouserStyleService.createTrouserStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryTrouserStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await TrouserStyle.queryTrouserStyle(filter, options);
  res.send(result);
});

const getTrouserStyleById = catchAsync(async (req, res) => {
  const user = await trouserStyleService.getTrouserStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserStyle not found');
  }
  res.send(user);
});

const updateTrouserStyleById = catchAsync(async (req, res) => {
  const user = await trouserStyleService.updateTrouserStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteTrouserStyleById = catchAsync(async (req, res) => {
  await trouserStyleService.deleteTrouserStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTrouserStyle,
  queryTrouserStyle,
  getTrouserStyleById,
  updateTrouserStyleById,
  deleteTrouserStyleById,
};
