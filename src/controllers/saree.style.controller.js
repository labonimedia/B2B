const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sareeStyleService } = require('../services');

const createSareetyle = catchAsync(async (req, res) => {
  const user = await sareeStyleService.createSareetyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySareetyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sareeStyleService.querySareetyle(filter, options);
  res.send(result);
});

const getSareetyleById = catchAsync(async (req, res) => {
  const user = await sareeStyleService.getSareetyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSareetyleById = catchAsync(async (req, res) => {
  const user = await sareeStyleService.updateSareetyleById(req.params.id, req.body);
  res.send(user);
});

const deleteSareetyleById = catchAsync(async (req, res) => {
  await sareeStyleService.deleteSareetyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSareetyle,
  querySareetyle,
  getSareetyleById,
  updateSareetyleById,
  deleteSareetyleById,
};
