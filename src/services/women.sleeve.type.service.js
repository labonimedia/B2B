const httpStatus = require('http-status');
const { WomenSleeveType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WomenSleeveType
 * @param {Object} reqBody
 * @returns {Promise<WomenSleeveType>}
 */
const createWomenSleeveType = async (reqBody) => {
  return WomenSleeveType.create(reqBody);
};

/**
 * Query for WomenSleeveType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWomenSleeveType = async (filter, options) => {
  const womenSleeveType = await WomenSleeveType.paginate(filter, options);
  return womenSleeveType;
};

/**
 * Get WomenSleeveType by id
 * @param {ObjectId} id
 * @returns {Promise<WomenSleeveType>}
 */
const getWomenSleeveTypeById = async (id) => {
  return WomenSleeveType.findById(id);
};

/**
 * Update WomenSleeveType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WomenSleeveType>}
 */
const updateWomenSleeveTypeById = async (id, updateBody) => {
  const user = await getWomenSleeveTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WomenSleeveType not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<WomenSleeveType>}
 */
const deleteWomenSleeveTypeById = async (id) => {
  const user = await getWomenSleeveTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WomenSleeveType not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWomenSleeveType,
  queryWomenSleeveType,
  getWomenSleeveTypeById,
  updateWomenSleeveTypeById,
  deleteWomenSleeveTypeById,
};
