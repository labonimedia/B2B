const httpStatus = require('http-status');
const { ClosureType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ClosureType
 * @param {Object} reqBody
 * @returns {Promise<ClosureType>}
 */
const createClosureType = async (reqBody) => {
  return ClosureType.create(reqBody);
};

/**
 * Query for ClosureType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClosureType = async (filter, options) => {
  const closureTypes = await ClosureType.paginate(filter, options);
  return closureTypes;
};

/**
 * Get ClosureType by id
 * @param {ObjectId} id
 * @returns {Promise<ClosureType>}
 */
const getClosureTypeById = async (id) => {
  return ClosureType.findById(id);
};

/**
 * Update ClosureType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ClosureType>}
 */
const updateClosureTypeById = async (id, updateBody) => {
  const user = await getClosureTypeById(id);
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
 * @returns {Promise<ClosureType>}
 */
const deleteClosureTypeById = async (id) => {
  const user = await getClosureTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createClosureType,
  queryClosureType,
  getClosureTypeById,
  updateClosureTypeById,
  deleteClosureTypeById,
};
