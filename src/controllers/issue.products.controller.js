const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { issueProductsService } = require('../services');

const createIssuedProducts = catchAsync(async (req, res) => {
  const user = await issueProductsService.createIssuedProducts(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryIssuedProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['customerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await issueProductsService.queryIssuedProducts(filter, options);
  res.send(result);
});

const getIssuedProductsById = catchAsync(async (req, res) => {
  const user = await issueProductsService.getIssuedProductsById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issued Products not found');
  }
  res.send(user);
});

const getIssuedProductsBycustomerEmail = catchAsync(async (req, res) => {
  const user = await issueProductsService.getIssuedProductsBycustomerEmail(req.query.customerEmail);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issued Products not found');
  }
  res.send(user);
});

const updateIssuedProductsById = catchAsync(async (req, res) => {
  const user = await issueProductsService.updateIssuedProductsById(req.params.id, req.body);
  res.send(user);
});

const deleteIssuedProductsById = catchAsync(async (req, res) => {
  await issueProductsService.deleteIssuedProductsById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createIssuedProducts,
  queryIssuedProducts,
  getIssuedProductsById,
  getIssuedProductsBycustomerEmail,
  updateIssuedProductsById,
  deleteIssuedProductsById,
};
