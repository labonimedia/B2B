const httpStatus = require('http-status');
const { ShirtSizeSet } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ShirtSizeSet
 * @param {Object} reqBody
 * @returns {Promise<ShirtSizeSet>}
 */
const createShirtSizeSet = async (reqBody) => {
  return ShirtSizeSet.create(reqBody);
};

/**
 * Query for ShirtSizeSet
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySeason = async (filter, options) => {
  const Seasons = await ShirtSizeSet.paginate(filter, options);
  return Seasons;
};

/**
 * Get ShirtSizeSet by id
 * @param {ObjectId} id
 * @returns {Promise<ShirtSizeSet>}
 */
const getShirtSizeSetById = async (id) => {
  return ShirtSizeSet.findById(id);
};

/**
 * Update ShirtSizeSet by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ShirtSizeSet>}
 */
const updateShirtSizeSetById = async (id, updateBody) => {
  const user = await getShirtSizeSetById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShirtSizeSet not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<ShirtSizeSet>}
 */
const deleteShirtSizeSetById = async (id) => {
  const user = await getShirtSizeSetById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShirtSizeSet not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createShirtSizeSet,
  querySeason,
  getShirtSizeSetById,
  updateShirtSizeSetById,
  deleteShirtSizeSetById,
};
