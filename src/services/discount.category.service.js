const httpStatus = require('http-status');
const { DiscountCategory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a DiscountCategory
 * @param {Object} reqBody
 * @returns {Promise<DiscountCategory>}
 */
const createDiscountCategory = async (reqBody) => {
  return DiscountCategory.create(reqBody);
};

/**
 * Query for DiscountCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDiscountCategory = async (filter, options) => {
  const DiscountCategorys = await DiscountCategory.paginate(filter, options);
  return DiscountCategorys;
};

/**
 * Get DiscountCategory by id
 * @param {ObjectId} id
 * @returns {Promise<DiscountCategory>}
 */
const getDiscountCategoryById = async (id) => {
  return DiscountCategory.findById(id);
};

/**
 * Update DiscountCategory by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<DiscountCategory>}
 */
const updateDiscountCategoryById = async (id, updateBody) => {
  const user = await getDiscountCategoryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DiscountCategory not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<DiscountCategory>}
 */
const deleteDiscountCategoryById = async (id) => {
  const user = await getDiscountCategoryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DiscountCategory not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createDiscountCategory,
  queryDiscountCategory,
  getDiscountCategoryById,
  updateDiscountCategoryById,
  deleteDiscountCategoryById,
};
