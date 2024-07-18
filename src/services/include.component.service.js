const httpStatus = require('http-status');
const { IncludeComponent } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a IncludeComponent
 * @param {Object} reqBody
 * @returns {Promise<IncludeComponent>}
 */
const createIncludeComponent = async (reqBody) => {
  return IncludeComponent.create(reqBody);
};

/**
 * Query for IncludeComponent
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIncludeComponent = async (filter, options) => {
  const IncludeComponent = await IncludeComponent.paginate(filter, options);
  return IncludeComponent;
};

/**
 * Get IncludeComponent by id
 * @param {ObjectId} id
 * @returns {Promise<IncludeComponent>}
 */
const getIncludeComponentById = async (id) => {
  return IncludeComponent.findById(id);
};

/**
 * Update IncludeComponent by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<IncludeComponent>}
 */
const updateIncludeComponentById = async (id, updateBody) => {
  const user = await getIncludeComponentById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncludeComponent not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<IncludeComponent>}
 */
const deleteIncludeComponentById = async (id) => {
  const user = await getIncludeComponentById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncludeComponent not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createIncludeComponent,
  queryIncludeComponent,
  getIncludeComponentById,
  updateIncludeComponentById,
  deleteIncludeComponentById,
};
