const httpStatus = require('http-status');
const { ManufactureMasterCategory } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create Category
 */
const createCategory = async (reqBody) => {
  return ManufactureMasterCategory.create(reqBody);
};

/**
 * Query Categories (with pagination)
 */
const queryCategories = async (filter, options) => {
  const categories = await ManufactureMasterCategory.paginate(filter, options);
  return categories;
};

/**
 * Get Category by ID
 */
const getCategoryById = async (id) => {
  return ManufactureMasterCategory.findById(id);
};

/**
 * Update Category by ID
 */
const updateCategoryById = async (id, updateBody) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete Category by ID
 */
const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  await category.remove();
  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
