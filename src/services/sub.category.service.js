const httpStatus = require('http-status');
const { SubCategory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SubCategory
 * @param {Object} reqBody
 * @returns {Promise<SubCategory>}
 */
const createSubCategory = async (reqBody) => {
  return SubCategory.create(reqBody);
};

/**
 * Query for SubCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubCategory = async (filter, options) => {
  const SubCategorys = await SubCategory.paginate(filter, options);
  return SubCategorys;
};

/**
 * Get SubCategory by id
 * @param {ObjectId} id
 * @returns {Promise<SubCategory>}
 */
const getSubCategoryById = async (id) => {
  return SubCategory.findById(id);
};

/**
 * Update SubCategory by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SubCategory>}
 */
const updateSubCategoryById = async (id, updateBody) => {
  const user = await getSubCategoryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sub Category not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<SubCategory>}
 */
const deleteSubCategoryById = async (id) => {
  const user = await getSubCategoryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sub Category not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSubCategory,
  querySubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
};
