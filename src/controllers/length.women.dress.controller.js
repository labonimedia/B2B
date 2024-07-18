const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lenthWomenDressService } = require('../services');

const createLenthWomenDress = catchAsync(async (req, res) => {
  const user = await lenthWomenDressService.createLenthWomenDress(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryLenthWomenDress = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await lenthWomenDressService.queryLenthWomenDress(filter, options);
  res.send(result);
});

const getLenthWomenDressById = catchAsync(async (req, res) => {
  const user = await lenthWomenDressService.getLenthWomenDressById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LenthWomenDress not found');
  }
  res.send(user);
});

const updateLenthWomenDressById = catchAsync(async (req, res) => {
  const user = await lenthWomenDressService.updateLenthWomenDressById(req.params.id, req.body);
  res.send(user);
});

const deleteLenthWomenDressById = catchAsync(async (req, res) => {
  await lenthWomenDressService.deleteLenthWomenDressById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLenthWomenDress,
  queryLenthWomenDress,
  getLenthWomenDressById,
  updateLenthWomenDressById,
  deleteLenthWomenDressById,
};
