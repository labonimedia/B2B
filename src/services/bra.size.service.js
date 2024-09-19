const httpStatus = require('http-status');
const { BraSize } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BraSize
 * @param {Object} reqBody
 * @returns {Promise<BraSize>}
 */
const createBraSize = async (reqBody) => {
  return BraSize.create(reqBody);
};

/**
 * Query for BraSize
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBraSize = async (filter, options) => {
  const braSizes = await BraSize.paginate(filter, options);
  return braSizes;
};

/**
 * Get BraSize by id
 * @param {ObjectId} id
 * @returns {Promise<BraSize>}
 */
const getBraSizeById = async (id) => {
  return BraSize.findById(id);
};

/**
 * Update BraSize by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BraSize>}
 */
const updateBraSizeById = async (id, updateBody) => {
  const user = await getBraSizeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<BraSize>}
 */
const deleteBraSizeById = async (id) => {
  const user = await getBraSizeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createBraSize,
  queryBraSize,
  getBraSizeById,
  updateBraSizeById,
  deleteBraSizeById,
};
