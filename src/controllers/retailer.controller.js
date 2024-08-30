const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { retailerService } = require('../services');

const fileupload = catchAsync(async (req, res) => {
  const user = await retailerService.fileupload(req, req.params.id);
  res.status(httpStatus.CREATED).send(user);
});

const createRetailer = catchAsync(async (req, res) => {
  if (!req.body.logo || req.body.logo.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Retailer logo not provided');
  }
  const brandLogoUrl = req.body.logo[0];
  const brandLogoPath = new URL(brandLogoUrl).pathname;

  req.body.logo = brandLogoPath;
  const user = await retailerService.createRetailer(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryRetailer = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await retailerService.queryRetailer(filter, options);
  res.send(result);
});

const getRetailerById = catchAsync(async (req, res) => {
  const user = await retailerService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  res.send(user);
});

const updateRetailerById = catchAsync(async (req, res) => {
  const user = await retailerService.updateRetailerById(req.params.email, req.body);
  res.send(user);
});

const deleteRetailerById = catchAsync(async (req, res) => {
  await retailerService.deleteRetailerById(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRetailer,
  queryRetailer,
  fileupload,
  getRetailerById,
  updateRetailerById,
  deleteRetailerById,
};
