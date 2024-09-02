const httpStatus = require('http-status');
const { TrouserFitType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TrouserFitType
 * @param {Object} reqBody
 * @returns {Promise<TrouserFitType>}
 */
const createTrouserFitType = async (reqBody) => {
  return TrouserFitType.create(reqBody);
};

/**
 * Query for TrouserFitType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTrouserFitType = async (filter, options) => {
  const trouserFitType = await TrouserFitType.paginate(filter, options);
  return trouserFitType;
};

/**
 * Get TrouserFitType by id
 * @param {ObjectId} id
 * @returns {Promise<TrouserFitType>}
 */
const getTrouserFitTypeById = async (id) => {
  return TrouserFitType.findById(id);
};

/**
 * Update TrouserFitType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<TrouserFitType>}
 */
const updateTrouserFitTypeById = async (id, updateBody) => {
  const user = await getTrouserFitTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserFitType not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<TrouserFitType>}
 */
const deleteTrouserFitTypeById = async (id) => {
  const user = await getTrouserFitTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserFitType not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createTrouserFitType,
  queryTrouserFitType,
  getTrouserFitTypeById,
  updateTrouserFitTypeById,
  deleteTrouserFitTypeById,
};
