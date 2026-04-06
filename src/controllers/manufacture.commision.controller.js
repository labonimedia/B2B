const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { manufactureCommissionService } = require('../services');

const createCommissionCategory = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.createCommissionCategory({
    ...req.body,
    categoryBy: req.user.email, // 🔥 auto set manufacturer
  });

  res.status(httpStatus.CREATED).send(data);
});

const queryCommissionCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category', 'categoryBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await manufactureCommissionService.queryCommissionCategory(filter, options);
  res.send(result);
});

const getCommissionCategoryById = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.getCommissionCategoryById(req.params.id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  res.send(data);
});

const updateCommissionCategoryById = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.updateCommissionCategoryById(
    req.params.id,
    req.body
  );

  res.send(data);
});

const deleteCommissionCategoryById = catchAsync(async (req, res) => {
  await manufactureCommissionService.deleteCommissionCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCommissionCategory,
  queryCommissionCategory,
  getCommissionCategoryById,
  updateCommissionCategoryById,
  deleteCommissionCategoryById,
};