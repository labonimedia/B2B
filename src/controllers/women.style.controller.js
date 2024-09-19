const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { womenStyleService } = require('../services');

const createWomenStyle = catchAsync(async (req, res) => {
  const user = await womenStyleService.createWomenStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWomenStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await womenStyleService.queryWomenStyle(filter, options);
  res.send(result);
});

const getWomenStyleById = catchAsync(async (req, res) => {
  const user = await womenStyleService.getWomenStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateWomenStyleById = catchAsync(async (req, res) => {
  const user = await womenStyleService.updateWomenStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteWomenStyleById = catchAsync(async (req, res) => {
  await womenStyleService.deleteWomenStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWomenStyle,
  queryWomenStyle,
  getWomenStyleById,
  updateWomenStyleById,
  deleteWomenStyleById,
};
