const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trouserPocketService } = require('../services');

const createTrouserPocket = catchAsync(async (req, res) => {
  const user = await trouserPocketService.createTrouserPocket(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryTrouserPocket = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await trouserPocketService.queryTrouserPocket(filter, options);
  res.send(result);
});

const getTrouserPocketById = catchAsync(async (req, res) => {
  const user = await trouserPocketService.getTrouserPocketById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserPocket not found');
  }
  res.send(user);
});

const updateTrouserPocketById = catchAsync(async (req, res) => {
  const user = await trouserPocketService.updateTrouserPocketById(req.params.id, req.body);
  res.send(user);
});

const deleteTrouserPocketById = catchAsync(async (req, res) => {
  await trouserPocketService.deleteTrouserPocketById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTrouserPocket,
  queryTrouserPocket,
  getTrouserPocketById,
  updateTrouserPocketById,
  deleteTrouserPocketById,
};
