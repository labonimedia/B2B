const httpStatus = require('http-status');
const { TrouserPocket } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TrouserPocket
 * @param {Object} reqBody
 * @returns {Promise<TrouserPocket>}
 */
const createTrouserPocket = async (reqBody) => {
  return TrouserPocket.create(reqBody);
};

/**
 * Query for TrouserPocket
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTrouserPocket = async (filter, options) => {
  const trouserPocket = await TrouserPocket.paginate(filter, options);
  return trouserPocket;
};

/**
 * Get TrouserPocket by id
 * @param {ObjectId} id
 * @returns {Promise<TrouserPocket>}
 */
const getTrouserPocketById = async (id) => {
  return TrouserPocket.findById(id);
};

/**
 * Update TrouserPocket by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<TrouserPocket>}
 */
const updateTrouserPocketById = async (id, updateBody) => {
  const user = await getTrouserPocketById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserPocket not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<TrouserPocket>}
 */
const deleteTrouserPocketById = async (id) => {
  const user = await getTrouserPocketById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrouserPocket not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createTrouserPocket,
  queryTrouserPocket,
  getTrouserPocketById,
  updateTrouserPocketById,
  deleteTrouserPocketById,
};
