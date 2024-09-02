const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { embellishmentFeaturesService } = require('../services');

const createEmbellishmentFeatures = catchAsync(async (req, res) => {
  const user = await embellishmentFeaturesService.createEmbellishmentFeatures(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryEmbellishmentFeatures = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await embellishmentFeaturesService.queryEmbellishmentFeatures(filter, options);
  res.send(result);
});

const getEmbellishmentFeaturesById = catchAsync(async (req, res) => {
  const user = await embellishmentFeaturesService.getEmbellishmentFeaturesById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'EmbellishmentFeatures not found');
  }
  res.send(user);
});

const updateEmbellishmentFeaturesById = catchAsync(async (req, res) => {
  const user = await embellishmentFeaturesService.updateEmbellishmentFeaturesById(req.params.id, req.body);
  res.send(user);
});

const deleteEmbellishmentFeaturesById = catchAsync(async (req, res) => {
  await embellishmentFeaturesService.deleteEmbellishmentFeaturesById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createEmbellishmentFeatures,
  queryEmbellishmentFeatures,
  getEmbellishmentFeaturesById,
  updateEmbellishmentFeaturesById,
  deleteEmbellishmentFeaturesById,
};
