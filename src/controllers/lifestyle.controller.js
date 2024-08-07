const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lifestyleService } = require('../services');

const createLifestyle = catchAsync(async (req, res) => {
  const user = await lifestyleService.createLifestyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryLifestyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await lifestyleService.queryLifestyle(filter, options);
  res.send(result);
});

const getLifestyleById = catchAsync(async (req, res) => {
  const user = await lifestyleService.getLifestyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lifestyle not found');
  }
  res.send(user);
});

const updateLifestyleById = catchAsync(async (req, res) => {
  const user = await lifestyleService.updateLifestyleById(req.params.id, req.body);
  res.send(user);
});

const deleteLifestyleById = catchAsync(async (req, res) => {
  await lifestyleService.deleteLifestyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLifestyle,
  queryLifestyle,
  getLifestyleById,
  updateLifestyleById,
  deleteLifestyleById,
};
