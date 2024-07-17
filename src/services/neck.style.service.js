const httpStatus = require('http-status');
const { NeckStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a NeckStyle
 * @param {Object} reqBody
 * @returns {Promise<NeckStyle>}
 */
const createNeckStyle = async (reqBody) => {
  return NeckStyle.create(reqBody);
};

/**
 * Query for NeckStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNeckStyle = async (filter, options) => {
  const NeckStyles = await NeckStyle.paginate(filter, options);
  return NeckStyles;
};

/**
 * Get NeckStyle by id
 * @param {ObjectId} id
 * @returns {Promise<NeckStyle>}
 */
const getNeckStyleById = async (id) => {
  return NeckStyle.findById(id);
};


/**
 * Update NeckStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<NeckStyle>}
 */
const updateNeckStyleById = async (id, updateBody) => {
  const user = await getNeckStyleById(id);
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
 * @returns {Promise<NeckStyle>}
 */
const deleteNeckStyleById = async (id) => {
  const user = await getNeckStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createNeckStyle,
  queryNeckStyle,
  getNeckStyleById,
  updateNeckStyleById,
  deleteNeckStyleById,
};
