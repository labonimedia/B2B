const httpStatus = require('http-status');
const { CountryCode } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a CountryCode
 * @param {Object} reqBody
 * @returns {Promise<CountryCode>}
 */
const createCountryCode = async (reqBody) => {
  return CountryCode.create(reqBody);
};

/**
 * Query for CountryCode
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCountryCode = async (filter, options) => {
  const countryCode = await CountryCode.paginate(filter, options);
  return countryCode;
};

/**
 * Get CountryCode by id
 * @param {ObjectId} id
 * @returns {Promise<CountryCode>}
 */
const getCountryCodeById = async (id) => {
  return CountryCode.findById(id);
};

/**
 * Update CountryCode by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<CountryCode>}
 */
const updateCountryCodeById = async (id, updateBody) => {
  const user = await getCountryCodeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CountryCode not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<CountryCode>}
 */
const deleteCountryCodeById = async (id) => {
  const user = await getCountryCodeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CountryCode not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCountryCode,
  queryCountryCode,
  getCountryCodeById,
  updateCountryCodeById,
  deleteCountryCodeById,
};
