const httpStatus = require('http-status');
const { FitType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a FitType
 * @param {Object} reqBody
 * @returns {Promise<FitType>}
 */
const createFitType = async (reqBody) => {
  return FitType.create(reqBody);
};

/**
 * Query for FitType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFitType = async (filter, options) => {
  const fitType = await FitType.paginate(filter, options);
  return fitType;
};

/**
 * Get FitType by id
 * @param {ObjectId} id
 * @returns {Promise<FitType>}
 */
const getFitTypeById = async (id) => {
  return FitType.findById(id);
};

/**
 * Update FitType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<FitType>}
 */
const updateFitTypeById = async (id, updateBody) => {
  const user = await getFitTypeById(id);
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
 * @returns {Promise<FitType>}
 */
const deleteFitTypeById = async (id) => {
  const user = await getFitTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createFitType,
  queryFitType,
  getFitTypeById,
  updateFitTypeById,
  deleteFitTypeById,
};
