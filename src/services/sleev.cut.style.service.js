const httpStatus = require('http-status');
const { SleevCutStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SleevCutStyle
 * @param {Object} reqBody
 * @returns {Promise<SleevCutStyle>}
 */
const createSleevCutStyle = async (reqBody) => {
  return SleevCutStyle.create(reqBody);
};

/**
 * Query for SleevCutStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySleevCutStyle = async (filter, options) => {
  const sleevCutStyle = await SleevCutStyle.paginate(filter, options);
  return sleevCutStyle;
};

/**
 * Get SleevCutStyle by id
 * @param {ObjectId} id
 * @returns {Promise<SleevCutStyle>}
 */
const getSleevCutStyleById = async (id) => {
  return SleevCutStyle.findById(id);
};

/**
 * Update SleevCutStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SleevCutStyle>}
 */
const updateSleevCutStyleById = async (id, updateBody) => {
  const user = await getSleevCutStyleById(id);
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
 * @returns {Promise<SleevCutStyle>}
 */
const deleteSleevCutStyleById = async (id) => {
  const user = await getSleevCutStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSleevCutStyle,
  querySleevCutStyle,
  getSleevCutStyleById,
  updateSleevCutStyleById,
  deleteSleevCutStyleById,
};
