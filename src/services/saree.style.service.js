const httpStatus = require('http-status');
const { SareeStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Sareetyle
 * @param {Object} reqBody
 * @returns {Promise<SareeStyle>}
 */
const createSareetyle = async (reqBody) => {
  return SareeStyle.create(reqBody);
};

/**
 * Query for Sareetyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySareetyle = async (filter, options) => {
  const sareetyles = await SareeStyle.paginate(filter, options);
  return sareetyles;
};

/**
 * Get Sareetyle by id
 * @param {ObjectId} id
 * @returns {Promise<SareeStyle>}
 */
const getSareetyleById = async (id) => {
  return SareeStyle.findById(id);
};

/**
 * Update Sareetyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Sareetyle>}
 */
const updateSareetyleById = async (id, updateBody) => {
  const user = await getSareetyleById(id);
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
 * @returns {Promise<Sareetyle>}
 */
const deleteSareetyleById = async (id) => {
  const user = await getSareetyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSareetyle,
  querySareetyle,
  getSareetyleById,
  updateSareetyleById,
  deleteSareetyleById,
};
