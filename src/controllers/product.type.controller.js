const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productTypeService } = require('../services');

const createProductType = catchAsync(async (req, res) => {
  const user = await productTypeService.createProductType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryProductType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productTypeService.queryProductType(filter, options);
  res.send(result);
});

const getProductTypeById = catchAsync(async (req, res) => {
  const user = await productTypeService.getProductTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductType not found');
  }
  res.send(user);
});

const updateProductTypeById = catchAsync(async (req, res) => {
  const user = await productTypeService.updateProductTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteProductTypeById = catchAsync(async (req, res) => {
  await productTypeService.deleteProductTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProductType,
  queryProductType,
  getProductTypeById,
  updateProductTypeById,
  deleteProductTypeById,
};
