const httpStatus = require('http-status');
const { MenStandardSize } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a MenStandardSize
 * @param {Object} reqBody
 * @returns {Promise<MenStandardSize>}
 */
const createMenStandardSize = async (reqBody) => {
  return MenStandardSize.create(reqBody);
};

/**
 * Query for MenStandardSize
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMenStandardSize = async (filter, options) => {
  const MenStandardSizes = await MenStandardSize.paginate(filter, options);
  return MenStandardSizes;
};

/**
 * Get MenStandardSize by id
 * @param {ObjectId} id
 * @returns {Promise<MenStandardSize>}
 */
const getMenStandardSizeById = async (id) => {
  return MenStandardSize.findById(id);
};


/**
 * Update MenStandardSize by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<MenStandardSize>}
 */
const updateMenStandardSizeById = async (id, updateBody) => {
  const user = await getMenStandardSizeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Men Standard Size not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<MenStandardSize>}
 */
const deleteMenStandardSizeById = async (id) => {
  const user = await getMenStandardSizeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Men Standard Size not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createMenStandardSize,
  queryMenStandardSize,
  getMenStandardSizeById,
  updateMenStandardSizeById,
  deleteMenStandardSizeById,
};
