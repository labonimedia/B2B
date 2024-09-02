const httpStatus = require('http-status');
const { NoOfPockets } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a NoOfPockets
 * @param {Object} reqBody
 * @returns {Promise<NoOfPockets>}
 */
const createNoOfPockets = async (reqBody) => {
  return NoOfPockets.create(reqBody);
};

/**
 * Query for NoOfPockets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNoOfPockets = async (filter, options) => {
  const noOfPockets = await NoOfPockets.paginate(filter, options);
  return noOfPockets;
};

/**
 * Get NoOfPockets by id
 * @param {ObjectId} id
 * @returns {Promise<NoOfPockets>}
 */
const getNoOfPocketsById = async (id) => {
  return NoOfPockets.findById(id);
};

/**
 * Update NoOfPockets by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<NoOfPockets>}
 */
const updateNoOfPocketsById = async (id, updateBody) => {
  const user = await getNoOfPocketsById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NoOfPockets not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<NoOfPockets>}
 */
const deleteNoOfPocketsById = async (id) => {
  const user = await getNoOfPocketsById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NoOfPockets not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createNoOfPockets,
  queryNoOfPockets,
  getNoOfPocketsById,
  updateNoOfPocketsById,
  deleteNoOfPocketsById,
};
