const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fitTypeService } = require('../services');

const createFitType = catchAsync(async (req, res) => {
  const user = await fitTypeService.createFitType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryFitType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await fitTypeService.queryFitType(filter, options);
  res.send(result);
});

const getFitTypeById = catchAsync(async (req, res) => {
  const user = await fitTypeService.getFitTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FitType not found');
  }
  res.send(user);
});

const updateFitTypeById = catchAsync(async (req, res) => {
  const user = await fitTypeService.updateFitTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteFitTypeById = catchAsync(async (req, res) => {
  await fitTypeService.deleteFitTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFitType,
  queryFitType,
  getFitTypeById,
  updateFitTypeById,
  deleteFitTypeById,
};
