const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { manufacturerCommissionCategoryService } = require('../../services');

const createCommissionCategory = catchAsync(async (req, res) => {
  const data = await manufacturerCommissionCategoryService.createCommissionCategory({
    ...req.body,
    categoryBy: req.user.email, // 🔥 auto set manufacturer
  });

  res.status(httpStatus.CREATED).send(data);
});

const queryCommissionCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category', 'categoryBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await manufacturerCommissionCategoryService.queryCommissionCategory(filter, options);
  res.send(result);
});

const getCommissionCategoryById = catchAsync(async (req, res) => {
  const data = await manufacturerCommissionCategoryService.getCommissionCategoryById(req.params.id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  res.send(data);
});

const updateCommissionCategoryById = catchAsync(async (req, res) => {
  const data = await manufacturerCommissionCategoryService.updateCommissionCategoryById(req.params.id, req.body);

  res.send(data);
});

const deleteCommissionCategoryById = catchAsync(async (req, res) => {
  await manufacturerCommissionCategoryService.deleteCommissionCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCommissionCategory,
  queryCommissionCategory,
  getCommissionCategoryById,
  updateCommissionCategoryById,
  deleteCommissionCategoryById,
};
