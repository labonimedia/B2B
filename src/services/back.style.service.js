const httpStatus = require('http-status');
const { BackStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BackStyle
 * @param {Object} reqBody
 * @returns {Promise<BackStyle>}
 */
const createBackStyle = async (reqBody) => {
  return BackStyle.create(reqBody);
};

/**
 * Query for BackStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBackStyle = async (filter, options) => {
  const backStyles = await BackStyle.paginate(filter, options);
  return backStyles;
};

/**
 * Get BackStyle by id
 * @param {ObjectId} id
 * @returns {Promise<BackStyle>}
 */
const getBackStyleById = async (id) => {
  return BackStyle.findById(id);
};

/**
 * Update BackStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BackStyle>}
 */
const updateBackStyleById = async (id, updateBody) => {
  const user = await getBackStyleById(id);
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
 * @returns {Promise<BackStyle>}
 */
const deleteBackStyleById = async (id) => {
  const user = await getBackStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createBackStyle,
  queryBackStyle,
  getBackStyleById,
  updateBackStyleById,
  deleteBackStyleById,
};
