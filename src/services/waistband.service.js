const httpStatus = require('http-status');
const { WaistBand } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WaistBand
 * @param {Object} reqBody
 * @returns {Promise<WaistBand>}
 */
const createWaistBand = async (reqBody) => {
  return WaistBand.create(reqBody);
};

/**
 * Query for WaistBand
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWaistBand = async (filter, options) => {
  const waistBand = await WaistBand.paginate(filter, options);
  return waistBand;
};

/**
 * Get WaistBand by id
 * @param {ObjectId} id
 * @returns {Promise<WaistBand>}
 */
const getWaistBandById = async (id) => {
  return WaistBand.findById(id);
};

/**
 * Update WaistBand by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WaistBand>}
 */
const updateWaistBandById = async (id, updateBody) => {
  const user = await getWaistBandById(id);
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
 * @returns {Promise<WaistBand>}
 */
const deleteWaistBandById = async (id) => {
  const user = await getWaistBandById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWaistBand,
  queryWaistBand,
  getWaistBandById,
  updateWaistBandById,
  deleteWaistBandById,
};
