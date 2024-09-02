const httpStatus = require('http-status');
const { TrouserStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TrouserStyle
 * @param {Object} reqBody
 * @returns {Promise<TrouserStyle>}
 */
const createTrouserStyle = async (reqBody) => {
  return TrouserStyle.create(reqBody);
};

/**
 * Query for TrouserStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTrouserStyle = async (filter, options) => {
  const trouserStyle = await TrouserStyle.paginate(filter, options);
  return trouserStyle;
};

/**
 * Get TrouserStyle by id
 * @param {ObjectId} id
 * @returns {Promise<TrouserStyle>}
 */
const getTrouserStyleById = async (id) => {
  return TrouserStyle.findById(id);
};

/**
 * Update TrouserStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<TrouserStyle>}
 */
const updateTrouserStyleById = async (id, updateBody) => {
  const user = await getTrouserStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserStyle not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<TrouserStyle>}
 */
const deleteTrouserStyleById = async (id) => {
  const user = await getTrouserStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserStyle not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createTrouserStyle,
  queryTrouserStyle,
  getTrouserStyleById,
  updateTrouserStyleById,
  deleteTrouserStyleById,
};
