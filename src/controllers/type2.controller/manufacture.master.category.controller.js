const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { manufactureCategoryService } = require("../../services");

const createCategory = catchAsync(async (req, res) => {
  const category = await manufactureCategoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: category });
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "isActive", "code","manufacturerEmail"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await manufactureCategoryService.queryCategories(filter, options);
  res.send({ success: true, data: result });
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await manufactureCategoryService.getCategoryById(req.params.id);
  if (!category) return res.status(404).send({ message: "Category not found" });
  res.send({ success: true, data: category });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const updated = await manufactureCategoryService.updateCategoryById(req.params.id, req.body);
  res.send({ success: true, data: updated });
});

const deleteCategoryById = catchAsync(async (req, res) => {
  await manufactureCategoryService.deleteCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
