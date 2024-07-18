const httpStatus = require('http-status');
const { Lifestyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Lifestyle
 * @param {Object} reqBody
 * @returns {Promise<Lifestyle>}
 */
const createLifestyle = async (reqBody) => {
  return Lifestyle.create(reqBody);
};

/**
 * Query for Lifestyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLifestyle = async (filter, options) => {
  const Lifestyles = await Lifestyle.paginate(filter, options);
  return Lifestyles;
};

/**
 * Get Lifestyle by id
 * @param {ObjectId} id
 * @returns {Promise<Lifestyle>}
 */
const getLifestyleById = async (id) => {
  return Lifestyle.findById(id);
};

/**
 * Update Lifestyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Lifestyle>}
 */
const updateLifestyleById = async (id, updateBody) => {
  const user = await getLifestyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lifestyle not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Lifestyle>}
 */
const deleteLifestyleById = async (id) => {
  const user = await getLifestyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lifestyle not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createLifestyle,
  queryLifestyle,
  getLifestyleById,
  updateLifestyleById,
  deleteLifestyleById,
};
