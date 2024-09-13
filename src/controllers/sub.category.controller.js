const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subCategoryService } = require('../services');

const createSubCategory = catchAsync(async (req, res) => {
  const user = await subCategoryService.createSubCategory(req.body);
  res.status(httpStatus.CREATED).send(user);
});

// const querySubCategory = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['productType', 'gender', 'category', 'subCategory']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await subCategoryService.querySubCategory(filter, options);
//   res.send(result);
// });
const querySubCategory = catchAsync(async (req, res) => {
  const filter = pick(req.body, ['productType', 'gender', 'category', 'subCategory']); // Filter from req.body
  const options = pick(req.query, ['sortBy', 'limit', 'page']); // Options from req.query
  const result = await subCategoryService.querySubCategory(filter, options);
  res.send(result);
});


const getCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productType', 'gender', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subCategoryService.querySubCategory(filter, options);
  res.send(result);
});

const getSubCategoryById = catchAsync(async (req, res) => {
  const user = await subCategoryService.getSubCategoryById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubCategory not found');
  }
  res.send(user);
});

const updateSubCategoryById = catchAsync(async (req, res) => {
  const user = await subCategoryService.updateSubCategoryById(req.params.id, req.body);
  res.send(user);
});

const deleteSubCategoryById = catchAsync(async (req, res) => {
  await subCategoryService.deleteSubCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubCategory,
  querySubCategory,
  getCategory,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
};
