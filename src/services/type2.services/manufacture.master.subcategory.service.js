const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { ManufactureMasterSubCategory } = require("../../models");

/**
 * Create Subcategory
 */
const createSubcategory = async (reqBody) => {
  return ManufactureMasterSubCategory.create(reqBody);
};

/**
 * Query Subcategories (with pagination)
 */
const querySubcategories = async (filter, options) => {
  const subcategories = await ManufactureMasterSubCategory.paginate(filter, options);
  return subcategories;
};

/**
 * Get Subcategory by ID
 */
const getSubcategoryById = async (id) => {
  return ManufactureMasterSubCategory.findById(id).populate("categoryId");
};

/**
 * Update Subcategory by ID
 */
const updateSubcategoryById = async (id, updateBody) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subcategory not found");
  }

  Object.assign(subcategory, updateBody);
  await subcategory.save();
  return subcategory;
};

/**
 * Delete Subcategory by ID
 */
const deleteSubcategoryById = async (id) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subcategory not found");
  }

  await subcategory.remove();
  return subcategory;
};

module.exports = {
  createSubcategory,
  querySubcategories,
  getSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
};
