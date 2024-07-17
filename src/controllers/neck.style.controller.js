const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { neckStyleService } = require('../services');

const createNeckStyle = catchAsync(async (req, res) => {
  const user = await neckStyleService.createNeckStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryNeckStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await neckStyleService.queryNeckStyle(filter, options);
  res.send(result);
});

const getNeckStyleById = catchAsync(async (req, res) => {
  const user = await neckStyleService.getNeckStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateNeckStyleById = catchAsync(async (req, res) => {
  const user = await neckStyleService.updateNeckStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteNeckStyleById = catchAsync(async (req, res) => {
  await neckStyleService.deleteNeckStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNeckStyle,
  queryNeckStyle,
  getNeckStyleById,
  updateNeckStyleById,
  deleteNeckStyleById,
};
