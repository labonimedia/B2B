const httpStatus = require('http-status');
const { RiseStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a RiseStyle
 * @param {Object} reqBody
 * @returns {Promise<RiseStyle>}
 */
const createRiseStyle = async (reqBody) => {
  return RiseStyle.create(reqBody);
};

/**
 * Query for RiseStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRiseStyle = async (filter, options) => {
  const riseStyle = await RiseStyle.paginate(filter, options);
  return riseStyle;
};

/**
 * Get RiseStyle by id
 * @param {ObjectId} id
 * @returns {Promise<RiseStyle>}
 */
const getRiseStyleById = async (id) => {
  return RiseStyle.findById(id);
};

/**
 * Update RiseStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<RiseStyle>}
 */
const updateRiseStyleById = async (id, updateBody) => {
  const user = await getRiseStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RiseStyle not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<RiseStyle>}
 */
const deleteRiseStyleById = async (id) => {
  const user = await getRiseStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RiseStyle not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createRiseStyle,
  queryRiseStyle,
  getRiseStyleById,
  updateRiseStyleById,
  deleteRiseStyleById,
};
