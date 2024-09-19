const httpStatus = require('http-status');
const { FinishType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a FinishType
 * @param {Object} reqBody
 * @returns {Promise<FinishType>}
 */
const createFinishType = async (reqBody) => {
  return FinishType.create(reqBody);
};

/**
 * Query for FinishType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFinishType = async (filter, options) => {
  const finishTypes = await FinishType.paginate(filter, options);
  return finishTypes;
};

/**
 * Get FinishType by id
 * @param {ObjectId} id
 * @returns {Promise<FinishType>}
 */
const getFinishTypeById = async (id) => {
  return FinishType.findById(id);
};

/**
 * Update FinishType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<FinishType>}
 */
const updateFinishTypeById = async (id, updateBody) => {
  const user = await getFinishTypeById(id);
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
 * @returns {Promise<FinishType>}
 */
const deleteFinishTypeById = async (id) => {
  const user = await getFinishTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createFinishType,
  queryFinishType,
  getFinishTypeById,
  updateFinishTypeById,
  deleteFinishTypeById,
};
