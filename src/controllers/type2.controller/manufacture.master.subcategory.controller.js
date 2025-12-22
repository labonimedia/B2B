const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { manufactureSubcategoryService } = require("../../services");

const createSubcategory = catchAsync(async (req, res) => {
  const subcategory = await manufactureSubcategoryService.createSubcategory(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: subcategory });
});

const getSubcategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["categoryId", "subcategoryName", "isActive"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await manufactureSubcategoryService.querySubcategories(filter, options);
  res.send({ success: true, data: result });
});

const getSubcategoryById = catchAsync(async (req, res) => {
  const subcategory = await manufactureSubcategoryService.getSubcategoryById(req.params.id);
  if (!subcategory) return res.status(404).send({ message: "Subcategory not found" });
  res.send({ success: true, data: subcategory });
});

const updateSubcategoryById = catchAsync(async (req, res) => {
  const updated = await manufactureSubcategoryService.updateSubcategoryById(
    req.params.id,
    req.body
  );
  res.send({ success: true, data: updated });
});

const deleteSubcategoryById = catchAsync(async (req, res) => {
  await manufactureSubcategoryService.deleteSubcategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
};
