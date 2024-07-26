const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { wholesalerCategoryService } = require('../services');

const createDiscountCategory = catchAsync(async (req, res) => {
  const user = await wholesalerCategoryService.createWholesalerCategory(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryDiscountCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category', 'categoryBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wholesalerCategoryService.queryWholesalerCategory(filter, options);
  res.send(result);
});

const getDiscountCategoryById = catchAsync(async (req, res) => {
  const user = await wholesalerCategoryService.getWholesalerCategoryById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DiscountCategory not found');
  }
  res.send(user);
});

const updateDiscountCategoryById = catchAsync(async (req, res) => {
  const user = await wholesalerCategoryService.updateWholesalerCategoryById(req.params.id, req.body);
  res.send(user);
});

const deleteDiscountCategoryById = catchAsync(async (req, res) => {
  await wholesalerCategoryService.deleteWholesalerCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDiscountCategory,
  queryDiscountCategory,
  getDiscountCategoryById,
  updateDiscountCategoryById,
  deleteDiscountCategoryById,
};
