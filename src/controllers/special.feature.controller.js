const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { specialFeatureService } = require('../services');

const createSpecialFeature = catchAsync(async (req, res) => {
  const user = await specialFeatureService.createSpecialFeature(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySpecialFeature = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await specialFeatureService.querySpecialFeature(filter, options);
  res.send(result);
});

const getSpecialFeatureById = catchAsync(async (req, res) => {
  const user = await specialFeatureService.getSpecialFeatureById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSpecialFeatureById = catchAsync(async (req, res) => {
  const user = await specialFeatureService.updateSpecialFeatureById(req.params.id, req.body);
  res.send(user);
});

const deleteSpecialFeatureById = catchAsync(async (req, res) => {
  await specialFeatureService.deleteSpecialFeatureById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSpecialFeature,
  querySpecialFeature,
  getSpecialFeatureById,
  updateSpecialFeatureById,
  deleteSpecialFeatureById,
};
