const httpStatus = require('http-status');
const { CoinPockets } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a CoinPockets
 * @param {Object} reqBody
 * @returns {Promise<CoinPockets>}
 */
const createCoinPockets = async (reqBody) => {
  return CoinPockets.create(reqBody);
};

/**
 * Query for CoinPockets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCoinPockets = async (filter, options) => {
  const coinPockets = await CoinPockets.paginate(filter, options);
  return coinPockets;
};

/**
 * Get CoinPockets by id
 * @param {ObjectId} id
 * @returns {Promise<CoinPockets>}
 */
const getCoinPocketsById = async (id) => {
  return CoinPockets.findById(id);
};

/**
 * Update CoinPockets by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<CoinPockets>}
 */
const updateCoinPocketsById = async (id, updateBody) => {
  const user = await getCoinPocketsById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CoinPockets not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<CoinPockets>}
 */
const deleteCoinPocketsById = async (id) => {
  const user = await getCoinPocketsById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CoinPockets not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCoinPockets,
  queryCoinPockets,
  getCoinPocketsById,
  updateCoinPocketsById,
  deleteCoinPocketsById,
};
