const httpStatus = require('http-status');
const { CollarStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a CollarStyle
 * @param {Object} reqBody
 * @returns {Promise<CollarStyle>}
 */
const createCollarStyle = async (reqBody) => {
  return CollarStyle.create(reqBody);
};

/**
 * Query for CollarStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCollarStyle = async (filter, options) => {
  const collarStyle = await CollarStyle.paginate(filter, options);
  return collarStyle;
};

/**
 * Get CollarStyle by id
 * @param {ObjectId} id
 * @returns {Promise<CollarStyle>}
 */
const getCollarStyleById = async (id) => {
  return CollarStyle.findById(id);
};

/**
 * Update CollarStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<CollarStyle>}
 */
const updateCollarStyleById = async (id, updateBody) => {
  const user = await getCollarStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CollarStyle not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<CollarStyle>}
 */
const deleteCollarStyleById = async (id) => {
  const user = await getCollarStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CollarStyle not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCollarStyle,
  queryCollarStyle,
  getCollarStyleById,
  updateCollarStyleById,
  deleteCollarStyleById,
};
