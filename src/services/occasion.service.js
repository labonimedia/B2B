const httpStatus = require('http-status');
const { Occasion } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Occasion
 * @param {Object} reqBody
 * @returns {Promise<Occasion>}
 */
const createOccasion = async (reqBody) => {
  return Occasion.create(reqBody);
};

/**
 * Query for Occasion
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOccasion = async (filter, options) => {
  const Occasion = await Occasion.paginate(filter, options);
  return Occasion;
};

/**
 * Get Occasion by id
 * @param {ObjectId} id
 * @returns {Promise<Occasion>}
 */
const getOccasionById = async (id) => {
  return Occasion.findById(id);
};

/**
 * Update Occasion by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Occasion>}
 */
const updateOccasionById = async (id, updateBody) => {
  const user = await getOccasionById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Occasion not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Occasion>}
 */
const deleteOccasionById = async (id) => {
  const user = await getOccasionById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createOccasion,
  queryOccasion,
  getOccasionById,
  updateOccasionById,
  deleteOccasionById,
};
