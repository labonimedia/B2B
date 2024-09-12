const httpStatus = require('http-status');
const { SocksSize } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SocksSize
 * @param {Object} reqBody
 * @returns {Promise<SocksSize>}
 */
const createSocksSize = async (reqBody) => {
  return SocksSize.create(reqBody);
};

/**
 * Query for SocksSize
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySocksSize = async (filter, options) => {
  const socksSizes = await SocksSize.paginate(filter, options);
  return socksSizes;
};

/**
 * Get SocksSize by id
 * @param {ObjectId} id
 * @returns {Promise<SocksSize>}
 */
const getSocksSizeById = async (id) => {
  return SocksSize.findById(id);
};

/**
 * Update SocksSize by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SocksSize>}
 */
const updateSocksSizeById = async (id, updateBody) => {
  const user = await getSocksSizeById(id);
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
 * @returns {Promise<SocksSize>}
 */
const deleteSocksSizeById = async (id) => {
  const user = await getSocksSizeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSocksSize,
  querySocksSize,
  getSocksSizeById,
  updateSocksSizeById,
  deleteSocksSizeById,
};
