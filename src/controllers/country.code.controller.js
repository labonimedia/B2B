const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { countryCodeService } = require('../services');

const createCountryCode = catchAsync(async (req, res) => {
  const user = await countryCodeService.createCountryCode(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCountryCode = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await countryCodeService.queryCountryCode(filter, options);
  res.send(result);
});

const getCountryCodeById = catchAsync(async (req, res) => {
  const user = await countryCodeService.getCountryCodeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CountryCode not found');
  }
  res.send(user);
});

const updateCountryCodeById = catchAsync(async (req, res) => {
  const user = await countryCodeService.updateCountryCodeById(req.params.id, req.body);
  res.send(user);
});

const deleteCountryCodeById = catchAsync(async (req, res) => {
  await countryCodeService.deleteCountryCodeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCountryCode,
  queryCountryCode,
  getCountryCodeById,
  updateCountryCodeById,
  deleteCountryCodeById,
};
