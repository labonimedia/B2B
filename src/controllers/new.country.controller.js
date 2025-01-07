const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { newCountryCodeService } = require('../services');

const createNewCountry = catchAsync(async (req, res) => {
  const user = await newCountryCodeService.createNewCountry(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryNewCountry = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await newCountryCodeService.queryNewCountry(filter, options);
  res.send(result);
});

const getNewCountryById = catchAsync(async (req, res) => {
  const user = await newCountryCodeService.getNewCountryById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NewCountry not found');
  }
  res.send(user);
});

const updateNewCountryById = catchAsync(async (req, res) => {
  const user = await newCountryCodeService.updateNewCountryById(req.params.id, req.body);
  res.send(user);
});

const deleteNewCountryById = catchAsync(async (req, res) => {
  await newCountryCodeService.deleteNewCountryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNewCountry,
  queryNewCountry,
  getNewCountryById,
  updateNewCountryById,
  deleteNewCountryById,
};
