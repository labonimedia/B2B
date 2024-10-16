const httpStatus = require('http-status');
const { Gender } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Gender
 * @param {Object} reqBody
 * @returns {Promise<Gender>}
 */
const createGender = async (reqBody) => {
  return Gender.create(reqBody);
};

/**
 * Query for Gender
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGender = async (filter, options) => {
  const genders = await Gender.paginate(filter, options);
  return genders;
};

/**
 * Get Gender by id
 * @param {ObjectId} id
 * @returns {Promise<Gender>}
 */
const getGenderById = async (id) => {
  return Gender.findById(id);
};

/**
 * Update Gender by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Gender>}
 */
const updateGenderById = async (id, updateBody) => {
  const user = await getGenderById(id);
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
 * @returns {Promise<Gender>}
 */
const deleteGenderById = async (id) => {
  const user = await getGenderById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createGender,
  queryGender,
  getGenderById,
  updateGenderById,
  deleteGenderById,
};
