const httpStatus = require('http-status');
const { Pattern } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Pattern
 * @param {Object} reqBody
 * @returns {Promise<Pattern>}
 */
const createPattern = async (reqBody) => {
  return Pattern.create(reqBody);
};

/**
 * Query for Pattern
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPattern = async (filter, options) => {
  const pattern = await Pattern.paginate(filter, options);
  return pattern;
};

/**
 * Get Pattern by id
 * @param {ObjectId} id
 * @returns {Promise<Pattern>}
 */
const getPatternById = async (id) => {
  return Pattern.findById(id);
};


/**
 * Update Pattern by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Pattern>}
 */
const updatePatternById = async (id, updateBody) => {
  const user = await getPatternById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pattern not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Pattern>}
 */
const deletePatternById = async (id) => {
  const user = await getPatternById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pattern not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createPattern,
  queryPattern,
  getPatternById,
  updatePatternById,
  deletePatternById,
};
