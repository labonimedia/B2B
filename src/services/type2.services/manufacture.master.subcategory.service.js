const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufactureMasterSubCategory } = require('../../models');

const createSubcategory = async (reqBody) => {
  if (Array.isArray(reqBody)) {
    if (reqBody.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Subcategory list cannot be empty');
    }
    const created = await ManufactureMasterSubCategory.insertMany(reqBody);
    return {
      success: true,
      message: 'Subcategories created successfully',
      count: created.length,
      data: created,
    };
  }
  const created = await ManufactureMasterSubCategory.create(reqBody);
  return {
    success: true,
    message: 'Subcategory created successfully',
    data: created,
  };
};

const querySubcategories = async (filter, options) => {
  const subcategories = await ManufactureMasterSubCategory.paginate(filter, options);
  return subcategories;
};

const getSubcategoryById = async (id) => {
  return ManufactureMasterSubCategory.findById(id).populate('categoryId');
};

const updateSubcategoryById = async (id, updateBody) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
  }
  Object.assign(subcategory, updateBody);
  await subcategory.save();
  return subcategory;
};

const deleteSubcategoryById = async (id) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
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
