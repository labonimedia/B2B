const httpStatus = require('http-status');
const { WomenStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WomenStyle
 * @param {Object} reqBody
 * @returns {Promise<WomenStyle>}
 */
const createWomenStyle = async (reqBody) => {
  return WomenStyle.create(reqBody);
};

/**
 * Query for WomenStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWomenStyle = async (filter, options) => {
  const womenStyles = await WomenStyle.paginate(filter, options);
  return womenStyles;
};

/**
 * Get WomenStyle by id
 * @param {ObjectId} id
 * @returns {Promise<WomenStyle>}
 */
const getWomenStyleById = async (id) => {
  return WomenStyle.findById(id);
};

/**
 * Update WomenStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WomenStyle>}
 */
const updateWomenStyleById = async (id, updateBody) => {
  const user = await getWomenStyleById(id);
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
 * @returns {Promise<WomenStyle>}
 */
const deleteWomenStyleById = async (id) => {
  const user = await getWomenStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWomenStyle,
  queryWomenStyle,
  getWomenStyleById,
  updateWomenStyleById,
  deleteWomenStyleById,
};
