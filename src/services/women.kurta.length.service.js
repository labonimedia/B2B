const httpStatus = require('http-status');
const { WomenKurtaLength } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WomenKurtaLength
 * @param {Object} reqBody
 * @returns {Promise<WomenKurtaLength>}
 */
const createWomenKurtaLength = async (reqBody) => {
  return WomenKurtaLength.create(reqBody);
};

/**
 * Query for WomenKurtaLength
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWomenKurtaLength = async (filter, options) => {
  const womenKurtaLengths = await WomenKurtaLength.paginate(filter, options);
  return womenKurtaLengths;
};

/**
 * Get WomenKurtaLength by id
 * @param {ObjectId} id
 * @returns {Promise<WomenKurtaLength>}
 */
const getWomenKurtaLengthById = async (id) => {
  return WomenKurtaLength.findById(id);
};

/**
 * Update WomenKurtaLength by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WomenKurtaLength>}
 */
const updateWomenKurtaLengthById = async (id, updateBody) => {
  const user = await getWomenKurtaLengthById(id);
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
 * @returns {Promise<WomenKurtaLength>}
 */
const deleteWomenKurtaLengthById = async (id) => {
  const user = await getWomenKurtaLengthById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWomenKurtaLength,
  queryWomenKurtaLength,
  getWomenKurtaLengthById,
  updateWomenKurtaLengthById,
  deleteWomenKurtaLengthById,
};
