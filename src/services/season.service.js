const httpStatus = require('http-status');
const { Season } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Season
 * @param {Object} reqBody
 * @returns {Promise<Season>}
 */
const createSeason = async (reqBody) => {
  return Season.create(reqBody);
};

/**
 * Query for Season
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySeason = async (filter, options) => {
  const Seasons = await Season.paginate(filter, options);
  return Seasons;
};

/**
 * Get Season by id
 * @param {ObjectId} id
 * @returns {Promise<Season>}
 */
const getSeasonById = async (id) => {
  return Season.findById(id);
};

/**
 * Update Season by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Season>}
 */
const updateSeasonById = async (id, updateBody) => {
  const user = await getSeasonById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Season not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Season>}
 */
const deleteSeasonById = async (id) => {
  const user = await getSeasonById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Season not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createSeason,
  querySeason,
  getSeasonById,
  updateSeasonById,
  deleteSeasonById,
};
