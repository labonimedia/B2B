const httpStatus = require('http-status');
const { Opacity } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Opacity
 * @param {Object} reqBody
 * @returns {Promise<Opacity>}
 */
const createOpacity = async (reqBody) => {
  return Opacity.create(reqBody);
};

/**
 * Query for Opacity
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOpacity = async (filter, options) => {
  const opacitys = await Opacity.paginate(filter, options);
  return opacitys;
};

/**
 * Get Opacity by id
 * @param {ObjectId} id
 * @returns {Promise<Opacity>}
 */
const getOpacityById = async (id) => {
  return Opacity.findById(id);
};

/**
 * Update Opacity by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Opacity>}
 */
const updateOpacityById = async (id, updateBody) => {
  const user = await getOpacityById(id);
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
 * @returns {Promise<Opacity>}
 */
const deleteOpacityById = async (id) => {
  const user = await getOpacityById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createOpacity,
  queryOpacity,
  getOpacityById,
  updateOpacityById,
  deleteOpacityById,
};
