const httpStatus = require('http-status');
const { SocksStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SocksStyle
 * @param {Object} reqBody
 * @returns {Promise<SocksStyle>}
 */
const createSocksStyle = async (reqBody) => {
  return SocksStyle.create(reqBody);
};

/**
 * Query for SocksStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySocksStyle = async (filter, options) => {
  const socksStyles = await SocksStyle.paginate(filter, options);
  return socksStyles;
};

/**
 * Get SocksStyle by id
 * @param {ObjectId} id
 * @returns {Promise<SocksStyle>}
 */
const getSocksStyleById = async (id) => {
  return SocksStyle.findById(id);
};

/**
 * Update SocksStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SocksStyle>}
 */
const updateSocksStyleById = async (id, updateBody) => {
  const user = await getSocksStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Socks Style not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<SocksStyle>}
 */
const deleteSocksStyleById = async (id) => {
  const user = await getSocksStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Socks Style not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSocksStyle,
  querySocksStyle,
  getSocksStyleById,
  updateSocksStyleById,
  deleteSocksStyleById,
};
