const httpStatus = require('http-status');
const { BlazerClouserType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BlazerClouserType
 * @param {Object} reqBody
 * @returns {Promise<BlazerClouserType>}
 */
const createBlazerClouserType = async (reqBody) => {
  return BlazerClouserType.create(reqBody);
};

/**
 * Query for BlazerClouserType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBlazerClouserType = async (filter, options) => {
  const blazerClouserTypes = await BlazerClouserType.paginate(filter, options);
  return blazerClouserTypes;
};

/**
 * Get BlazerClouserType by id
 * @param {ObjectId} id
 * @returns {Promise<BlazerClouserType>}
 */
const getBlazerClouserTypeById = async (id) => {
  return BlazerClouserType.findById(id);
};

/**
 * Update BlazerClouserType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BlazerClouserType>}
 */
const updateBlazerClouserTypeById = async (id, updateBody) => {
  const user = await getBlazerClouserTypeById(id);
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
 * @returns {Promise<BlazerClouserType>}
 */
const deleteBlazerClouserTypeById = async (id) => {
  const user = await getBlazerClouserTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createBlazerClouserType,
  queryBlazerClouserType,
  getBlazerClouserTypeById,
  updateBlazerClouserTypeById,
  deleteBlazerClouserTypeById,
};
