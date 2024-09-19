const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { womenKurtaLengthService } = require('../services');

const createWomenKurtaLength = catchAsync(async (req, res) => {
  const user = await womenKurtaLengthService.createWomenKurtaLength(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWomenKurtaLength = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await womenKurtaLengthService.queryWomenKurtaLength(filter, options);
  res.send(result);
});

const getWomenKurtaLengthById = catchAsync(async (req, res) => {
  const user = await womenKurtaLengthService.getWomenKurtaLengthById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateWomenKurtaLengthById = catchAsync(async (req, res) => {
  const user = await womenKurtaLengthService.updateWomenKurtaLengthById(req.params.id, req.body);
  res.send(user);
});

const deleteWomenKurtaLengthById = catchAsync(async (req, res) => {
  await womenKurtaLengthService.deleteWomenKurtaLengthById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWomenKurtaLength,
  queryWomenKurtaLength,
  getWomenKurtaLengthById,
  updateWomenKurtaLengthById,
  deleteWomenKurtaLengthById,
};
