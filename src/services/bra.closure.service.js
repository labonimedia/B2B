const httpStatus = require('http-status');
const { BraClosure } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BraClosure
 * @param {Object} reqBody
 * @returns {Promise<BraClosure>}
 */
const createBraClosure = async (reqBody) => {
  return BraClosure.create(reqBody);
};

/**
 * Query for BraClosure
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBraClosure = async (filter, options) => {
  const braClosures = await BraClosure.paginate(filter, options);
  return braClosures;
};

/**
 * Get BraClosure by id
 * @param {ObjectId} id
 * @returns {Promise<BraClosure>}
 */
const getBraClosureById = async (id) => {
  return BraClosure.findById(id);
};

/**
 * Update BraClosure by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BraClosure>}
 */
const updateBraClosureById = async (id, updateBody) => {
  const user = await getBraClosureById(id);
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
 * @returns {Promise<BraClosure>}
 */
const deleteBraClosureById = async (id) => {
  const user = await getBraClosureById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createBraClosure,
  queryBraClosure,
  getBraClosureById,
  updateBraClosureById,
  deleteBraClosureById,
};
