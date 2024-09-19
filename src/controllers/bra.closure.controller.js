const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { braClosureService } = require('../services');

const createBraClosure = catchAsync(async (req, res) => {
  const user = await braClosureService.createBraClosure(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBraClosure = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await braClosureService.queryBraClosure(filter, options);
  res.send(result);
});

const getBraClosureById = catchAsync(async (req, res) => {
  const user = await braClosureService.getBraClosureById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateBraClosureById = catchAsync(async (req, res) => {
  const user = await braClosureService.updateBraClosureById(req.params.id, req.body);
  res.send(user);
});

const deleteBraClosureById = catchAsync(async (req, res) => {
  await braClosureService.deleteBraClosureById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBraClosure,
  queryBraClosure,
  getBraClosureById,
  updateBraClosureById,
  deleteBraClosureById,
};
