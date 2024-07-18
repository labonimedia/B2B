const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { womenDressStyleService } = require('../services');

const createWomenDressStyle = catchAsync(async (req, res) => {
  const user = await womenDressStyleService.createWomenDressStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWomenDressStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await womenDressStyleService.queryWomenDressStyle(filter, options);
  res.send(result);
});

const getWomenDressStyleById = catchAsync(async (req, res) => {
  const user = await womenDressStyleService.getWomenDressStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'women dress Style not found');
  }
  res.send(user);
});

const updateWomenDressStyleById = catchAsync(async (req, res) => {
  const user = await womenDressStyleService.updateWomenDressStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteWomenDressStyleById = catchAsync(async (req, res) => {
  await womenDressStyleService.deleteWomenDressStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWomenDressStyle,
  queryWomenDressStyle,
  getWomenDressStyleById,
  updateWomenDressStyleById,
  deleteWomenDressStyleById,
};
