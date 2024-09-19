const httpStatus = require('http-status');
const { CupSize } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a CupSize
 * @param {Object} reqBody
 * @returns {Promise<CupSize>}
 */
const createCupSize = async (reqBody) => {
  return CupSize.create(reqBody);
};

/**
 * Query for CupSize
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCupSize = async (filter, options) => {
  const cupSizes = await CupSize.paginate(filter, options);
  return cupSizes;
};

/**
 * Get CupSize by id
 * @param {ObjectId} id
 * @returns {Promise<CupSize>}
 */
const getCupSizeById = async (id) => {
  return CupSize.findById(id);
};

/**
 * Update CupSize by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<CupSize>}
 */
const updateCupSizeById = async (id, updateBody) => {
  const user = await getCupSizeById(id);
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
 * @returns {Promise<CupSize>}
 */
const deleteCupSizeById = async (id) => {
  const user = await getCupSizeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCupSize,
  queryCupSize,
  getCupSizeById,
  updateCupSizeById,
  deleteCupSizeById,
};
