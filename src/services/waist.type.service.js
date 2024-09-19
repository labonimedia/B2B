const httpStatus = require('http-status');
const { WaistType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WaistType
 * @param {Object} reqBody
 * @returns {Promise<WaistType>}
 */
const createWaistType = async (reqBody) => {
  return WaistType.create(reqBody);
};

/**
 * Query for WaistType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWaistType = async (filter, options) => {
  const waistTypes = await WaistType.paginate(filter, options);
  return waistTypes;
};

/**
 * Get WaistType by id
 * @param {ObjectId} id
 * @returns {Promise<WaistType>}
 */
const getWaistTypeById = async (id) => {
  return WaistType.findById(id);
};

/**
 * Update WaistType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WaistType>}
 */
const updateWaistTypeById = async (id, updateBody) => {
  const user = await getWaistTypeById(id);
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
 * @returns {Promise<WaistType>}
 */
const deleteWaistTypeById = async (id) => {
  const user = await getWaistTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWaistType,
  queryWaistType,
  getWaistTypeById,
  updateWaistTypeById,
  deleteWaistTypeById,
};
