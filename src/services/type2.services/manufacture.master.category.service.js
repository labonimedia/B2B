const httpStatus = require('http-status');
const { ManufactureMasterCategory } = require('../../models');
const ApiError = require('../../utils/ApiError');

const createCategory = async (reqBody) => {
  // If array → bulk insert
  if (Array.isArray(reqBody)) {
    if (reqBody.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category array cannot be empty');
    }

    return ManufactureMasterCategory.insertMany(reqBody, { ordered: false });
  }

  return ManufactureMasterCategory.create(reqBody);
};

const queryCategories = async (filter, options) => {
  const categories = await ManufactureMasterCategory.paginate(filter, options);
  return categories;
};

const getCategoryById = async (id) => {
  return ManufactureMasterCategory.findById(id);
};

const updateCategoryById = async (id, updateBody) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
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
