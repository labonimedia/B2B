const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { elasticService } = require('../services');

const createElastic = catchAsync(async (req, res) => {
  const user = await elasticService.createElastic(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryElastic = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await elasticService.queryElastic(filter, options);
  res.send(result);
});

const getElasticById = catchAsync(async (req, res) => {
  const user = await elasticService.getElasticById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Elastic not found');
  }
  res.send(user);
});

const updateElasticById = catchAsync(async (req, res) => {
  const user = await elasticService.updateElasticById(req.params.id, req.body);
  res.send(user);
});

const deleteElasticById = catchAsync(async (req, res) => {
  await elasticService.deleteElasticById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createElastic,
  queryElastic,
  getElasticById,
  updateElasticById,
  deleteElasticById,
};
