const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { OccasionService } = require('../services');

const createOccasion = catchAsync(async (req, res) => {
  const user = await OccasionService.createOccasion(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryOccasion = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await OccasionService.queryOccasion(filter, options);
  res.send(result);
});

const getOccasionById = catchAsync(async (req, res) => {
  const user = await OccasionService.getOccasionById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Care Instruction not found');
  }
  res.send(user);
});

const updateOccasionById = catchAsync(async (req, res) => {
  const user = await OccasionService.updateOccasionById(req.params.id, req.body);
  res.send(user);
});

const deleteOccasionById = catchAsync(async (req, res) => {
  await OccasionService.deleteOccasionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOccasion,
  queryOccasion,
  getOccasionById,
  updateOccasionById,
  deleteOccasionById,
};
