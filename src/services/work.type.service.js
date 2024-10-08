const httpStatus = require('http-status');
const { WorkType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WorkType
 * @param {Object} reqBody
 * @returns {Promise<WorkType>}
 */
const createWorkType = async (reqBody) => {
  return WorkType.create(reqBody);
};

/**
 * Query for WorkType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWorkType = async (filter, options) => {
  const workTypes = await WorkType.paginate(filter, options);
  return workTypes;
};

/**
 * Get WorkType by id
 * @param {ObjectId} id
 * @returns {Promise<WorkType>}
 */
const getWorkTypeById = async (id) => {
  return WorkType.findById(id);
};

/**
 * Update WorkType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WorkType>}
 */
const updateWorkTypeById = async (id, updateBody) => {
  const user = await getWorkTypeById(id);
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
 * @returns {Promise<WorkType>}
 */
const deleteWorkTypeById = async (id) => {
  const user = await getWorkTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWorkType,
  queryWorkType,
  getWorkTypeById,
  updateWorkTypeById,
  deleteWorkTypeById,
};
