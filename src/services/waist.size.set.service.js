const httpStatus = require('http-status');
const { WaistSizeSet } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WaistSizeSet
 * @param {Object} reqBody
 * @returns {Promise<WaistSizeSet>}
 */
const createWaistSizeSet = async (reqBody) => {
  return WaistSizeSet.create(reqBody);
};

/**
 * Query for WaistSizeSet
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWaistSizeSet = async (filter, options) => {
  const waistSizeSet = await WaistSizeSet.paginate(filter, options);
  return waistSizeSet;
};

/**
 * Get WaistSizeSet by id
 * @param {ObjectId} id
 * @returns {Promise<WaistSizeSet>}
 */
const getWaistSizeSetById = async (id) => {
  return WaistSizeSet.findById(id);
};

/**
 * Update WaistSizeSet by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WaistSizeSet>}
 */
const updateWaistSizeSetById = async (id, updateBody) => {
  const user = await getWaistSizeSetById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WaistSizeSet not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<WaistSizeSet>}
 */
const deleteWaistSizeSetById = async (id) => {
  const user = await getWaistSizeSetById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WaistSizeSet not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWaistSizeSet,
  queryWaistSizeSet,
  getWaistSizeSetById,
  updateWaistSizeSetById,
  deleteWaistSizeSetById,
};
