const httpStatus = require('http-status');
const { WomenDressStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WomenDressStyle
 * @param {Object} reqBody
 * @returns {Promise<WomenDressStyle>}
 */
const createWomenDressStyle = async (reqBody) => {
  return WomenDressStyle.create(reqBody);
};

/**
 * Query for WomenDressStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWomenDressStyle = async (filter, options) => {
  const WomenDressStyles = await WomenDressStyle.paginate(filter, options);
  return WomenDressStyles;
};

/**
 * Get WomenDressStyle by id
 * @param {ObjectId} id
 * @returns {Promise<WomenDressStyle>}
 */
const getWomenDressStyleById = async (id) => {
  return WomenDressStyle.findById(id);
};

/**
 * Update WomenDressStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WomenDressStyle>}
 */
const updateWomenDressStyleById = async (id, updateBody) => {
  const user = await getWomenDressStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Women Dress Style not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<WomenDressStyle>}
 */
const deleteWomenDressStyleById = async (id) => {
  const user = await getWomenDressStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Women Dress Style not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWomenDressStyle,
  queryWomenDressStyle,
  getWomenDressStyleById,
  updateWomenDressStyleById,
  deleteWomenDressStyleById,
};
