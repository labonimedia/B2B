const httpStatus = require('http-status');
const { BraStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BraStyle
 * @param {Object} reqBody
 * @returns {Promise<BraStyle>}
 */
const createBraStyle = async (reqBody) => {
  return BraStyle.create(reqBody);
};

/**
 * Query for BraStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBraStyle = async (filter, options) => {
  const braStyles = await BraStyle.paginate(filter, options);
  return braStyles;
};

/**
 * Get BraStyle by id
 * @param {ObjectId} id
 * @returns {Promise<BraStyle>}
 */
const getBraStyleById = async (id) => {
  return BraStyle.findById(id);
};

/**
 * Update BraStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BraStyle>}
 */
const updateBraStyleById = async (id, updateBody) => {
  const user = await getBraStyleById(id);
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
 * @returns {Promise<BraStyle>}
 */
const deleteBraStyleById = async (id) => {
  const user = await getBraStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createBraStyle,
  queryBraStyle,
  getBraStyleById,
  updateBraStyleById,
  deleteBraStyleById,
};
