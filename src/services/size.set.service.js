const httpStatus = require('http-status');
const { SizeSet } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SizeSet
 * @param {Object} reqBody
 * @returns {Promise<SizeSet>}
 */
const createSizeSet = async (reqBody) => {
  return SizeSet.create(reqBody);
};

/**
 * Query for SizeSet
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySizeSet = async (filter, options) => {
  const menStandardSizes = await SizeSet.paginate(filter, options);
  return menStandardSizes;
};

/**
 * Get SizeSet by id
 * @param {ObjectId} id
 * @returns {Promise<SizeSet>}
 */
const getSizeSetById = async (id) => {
  return SizeSet.findById(id);
};

/**
 * Get SizeSet by id
 * @param {ObjectId} id
 * @returns {Promise<SizeSet>}
 */
const getSizeSetByType = async (sizeType) => {
  return SizeSet.findOne({sizeType});
};

/**
 * Update SizeSet by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SizeSet>}
 */
const updateSizeSetById = async (id, updateBody) => {
  const user = await getSizeSetById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Size set not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<SizeSet>}
 */
const deleteSizeSetById = async (id) => {
  const user = await getSizeSetById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Size set not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSizeSet,
  querySizeSet,
  getSizeSetById,
  getSizeSetByType,
  updateSizeSetById,
  deleteSizeSetById,
};
