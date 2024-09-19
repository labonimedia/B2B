const httpStatus = require('http-status');
const { WeaveType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WeaveType
 * @param {Object} reqBody
 * @returns {Promise<WeaveType>}
 */
const createWeaveType = async (reqBody) => {
  return WeaveType.create(reqBody);
};

/**
 * Query for WeaveType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWeaveType = async (filter, options) => {
  const weaveTypes = await WeaveType.paginate(filter, options);
  return weaveTypes;
};

/**
 * Get WeaveType by id
 * @param {ObjectId} id
 * @returns {Promise<WeaveType>}
 */
const getWeaveTypeById = async (id) => {
  return WeaveType.findById(id);
};

/**
 * Update WeaveType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WeaveType>}
 */
const updateWeaveTypeById = async (id, updateBody) => {
  const user = await getWeaveTypeById(id);
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
 * @returns {Promise<WeaveType>}
 */
const deleteWeaveTypeById = async (id) => {
  const user = await getWeaveTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWeaveType,
  queryWeaveType,
  getWeaveTypeById,
  updateWeaveTypeById,
  deleteWeaveTypeById,
};
