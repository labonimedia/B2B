const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trouserFitTypeService } = require('../services');

const createTrouserFitType = catchAsync(async (req, res) => {
  const user = await trouserFitTypeService.createTrouserFitType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryTrouserFitType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await TrouserFitType.queryTrouserFitType(filter, options);
  res.send(result);
});

const getTrouserFitTypeById = catchAsync(async (req, res) => {
  const user = await trouserFitTypeService.getTrouserFitTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserFitType not found');
  }
  res.send(user);
});

const updateTrouserFitTypeById = catchAsync(async (req, res) => {
  const user = await trouserFitTypeService.updateTrouserFitTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteTrouserFitTypeById = catchAsync(async (req, res) => {
  await trouserFitTypeService.deleteTrouserFitTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTrouserFitType,
  queryTrouserFitType,
  getTrouserFitTypeById,
  updateTrouserFitTypeById,
  deleteTrouserFitTypeById,
};
