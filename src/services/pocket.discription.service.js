const httpStatus = require('http-status');
const { PocketDiscription } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a PocketDiscription
 * @param {Object} reqBody
 * @returns {Promise<PocketDiscription>}
 */
const createPocketDiscription = async (reqBody) => {
  return PocketDiscription.create(reqBody);
};

/**
 * Query for PocketDiscription
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPocketDiscription = async (filter, options) => {
  const PocketDiscriptions = await PocketDiscription.paginate(filter, options);
  return PocketDiscriptions;
};

/**
 * Get PocketDiscription by id
 * @param {ObjectId} id
 * @returns {Promise<PocketDiscription>}
 */
const getPocketDiscriptionById = async (id) => {
  return PocketDiscription.findById(id);
};


/**
 * Update PocketDiscription by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<PocketDiscription>}
 */
const updatePocketDiscriptionById = async (id, updateBody) => {
  const user = await getPocketDiscriptionById(id);
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
 * @returns {Promise<PocketDiscription>}
 */
const deletePocketDiscriptionById = async (id) => {
  const user = await getPocketDiscriptionById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createPocketDiscription,
  queryPocketDiscription,
  getPocketDiscriptionById,
  updatePocketDiscriptionById,
  deletePocketDiscriptionById,
};
