const httpStatus = require('http-status');
const { SpecialFeature } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SpecialFeature
 * @param {Object} reqBody
 * @returns {Promise<SpecialFeature>}
 */
const createSpecialFeature = async (reqBody) => {
  return SpecialFeature.create(reqBody);
};

/**
 * Query for SpecialFeature
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySpecialFeature = async (filter, options) => {
  const specialFeatures = await SpecialFeature.paginate(filter, options);
  return specialFeatures;
};

/**
 * Get SpecialFeature by id
 * @param {ObjectId} id
 * @returns {Promise<SpecialFeature>}
 */
const getSpecialFeatureById = async (id) => {
  return SpecialFeature.findById(id);
};

/**
 * Update SpecialFeature by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SpecialFeature>}
 */
const updateSpecialFeatureById = async (id, updateBody) => {
  const user = await getSpecialFeatureById(id);
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
 * @returns {Promise<SpecialFeature>}
 */
const deleteSpecialFeatureById = async (id) => {
  const user = await getSpecialFeatureById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Special Feature not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSpecialFeature,
  querySpecialFeature,
  getSpecialFeatureById,
  updateSpecialFeatureById,
  deleteSpecialFeatureById,
};
