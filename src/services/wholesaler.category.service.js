const httpStatus = require('http-status');
const { WholesalerCategory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WholesalerCategory
 * @param {Object} reqBody
 * @returns {Promise<WholesalerCategory>}
 */
const createWholesalerCategory = async (reqBody) => {
  return WholesalerCategory.create(reqBody);
};

/**
 * Query for WholesalerCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWholesalerCategory = async (filter, options) => {
  const WholesalerCategorys = await WholesalerCategory.paginate(filter, options);
  return WholesalerCategorys;
};

/**
 * Get WholesalerCategory by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerCategory>}
 */
const getWholesalerCategoryById = async (id) => {
  return WholesalerCategory.findById(id);
};

/**
 * Update WholesalerCategory by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WholesalerCategory>}
 */
const updateWholesalerCategoryById = async (id, updateBody) => {
  const user = await getWholesalerCategoryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler Category not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<WholesalerCategory>}
 */
const deleteWholesalerCategoryById = async (id) => {
  const user = await getWholesalerCategoryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler Category not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWholesalerCategory,
  queryWholesalerCategory,
  getWholesalerCategoryById,
  updateWholesalerCategoryById,
  deleteWholesalerCategoryById,
};
