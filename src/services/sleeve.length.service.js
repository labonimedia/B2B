const httpStatus = require('http-status');
const { SleeveLength } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SleeveLength
 * @param {Object} reqBody
 * @returns {Promise<SleeveLength>}
 */
const createSleeveLength = async (reqBody) => {
  return SleeveLength.create(reqBody);
};

/**
 * Query for SleeveLength
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySleeveLength = async (filter, options) => {
  const sleeveLengths = await SleeveLength.paginate(filter, options);
  return sleeveLengths;
};

/**
 * Get SleeveLength by id
 * @param {ObjectId} id
 * @returns {Promise<SleeveLength>}
 */
const getSleeveLengthById = async (id) => {
  return SleeveLength.findById(id);
};

/**
 * Update SleeveLength by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SleeveLength>}
 */
const updateSleeveLengthById = async (id, updateBody) => {
  const user = await getSleeveLengthById(id);
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
 * @returns {Promise<SleeveLength>}
 */
const deleteSleeveLengthById = async (id) => {
  const user = await getSleeveLengthById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSleeveLength,
  querySleeveLength,
  getSleeveLengthById,
  updateSleeveLengthById,
  deleteSleeveLengthById,
};
