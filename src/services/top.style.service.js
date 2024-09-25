const httpStatus = require('http-status');
const { TopStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TopType
 * @param {Object} reqBody
 * @returns {Promise<TopType>}
 */
const createTopType = async (reqBody) => {
  return TopStyle.create(reqBody);
};

/**
 * Query for TopType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTopType = async (filter, options) => {
  const topType = await TopStyle.paginate(filter, options);
  return topType;
};

/**
 * Get TopType by id
 * @param {ObjectId} id
 * @returns {Promise<TopType>}
 */
const getTopTypeById = async (id) => {
  return TopStyle.findById(id);
};

/**
 * Update TopType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<TopType>}
 */
const updateTopTypeById = async (id, updateBody) => {
  const user = await getTopTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TopStyle not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<TopType>}
 */
const deleteTopTypeById = async (id) => {
  const user = await getTopTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TopStyle not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createTopType,
  queryTopType,
  getTopTypeById,
  updateTopTypeById,
  deleteTopTypeById,
};
