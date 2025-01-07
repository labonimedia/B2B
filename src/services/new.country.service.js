const httpStatus = require('http-status');
const { NewCountry } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a NewCountry
 * @param {Object} reqBody
 * @returns {Promise<NewCountry>}
 */
const createNewCountry = async (reqBody) => {
  return NewCountry.create(reqBody);
};

/**
 * Query for NewCountry
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNewCountry = async (filter, options) => {
  const newCountry = await NewCountry.paginate(filter, options);
  return newCountry;
};

/**
 * Get NewCountry by id
 * @param {ObjectId} id
 * @returns {Promise<NewCountry>}
 */
const getNewCountryById = async (id) => {
  return NewCountry.findById(id);
};

/**
 * Update NewCountry by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<NewCountry>}
 */
const updateNewCountryById = async (id, updateBody) => {
  const user = await getNewCountryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NewCountry not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<NewCountry>}
 */
const deleteNewCountryById = async (id) => {
  const user = await getNewCountryById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NewCountry not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createNewCountry,
  queryNewCountry,
  getNewCountryById,
  updateNewCountryById,
  deleteNewCountryById,
};
