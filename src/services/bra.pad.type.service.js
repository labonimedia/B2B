const httpStatus = require('http-status');
const { BraPadType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BraPadType
 * @param {Object} reqBody
 * @returns {Promise<BraPadType>}
 */
const createBraPadType = async (reqBody) => {
  return BraPadType.create(reqBody);
};

/**
 * Query for BraPadType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBraPadType = async (filter, options) => {
  const braPadTypes = await BraPadType.paginate(filter, options);
  return braPadTypes;
};

/**
 * Get BraPadType by id
 * @param {ObjectId} id
 * @returns {Promise<BraPadType>}
 */
const getBraPadTypeById = async (id) => {
  return BraPadType.findById(id);
};

/**
 * Update BraPadType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BraPadType>}
 */
const updateBraPadTypeById = async (id, updateBody) => {
  const user = await getBraPadTypeById(id);
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
 * @returns {Promise<BraPadType>}
 */
const deleteBraPadTypeById = async (id) => {
  const user = await getBraPadTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createBraPadType,
  queryBraPadType,
  getBraPadTypeById,
  updateBraPadTypeById,
  deleteBraPadTypeById,
};
