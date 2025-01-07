const httpStatus = require('http-status');
const { City } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a City
 * @param {Object} reqBody
 * @returns {Promise<City>}
 */
const createCity = async (reqBody) => {
  return City.create(reqBody);
};

/**
 * Query for City
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCity = async (filter, options) => {
  const citys = await City.paginate(filter, options);
  return citys;
};

/**
 * Get City by id
 * @param {ObjectId} id
 * @returns {Promise<City>}
 */
const getCityById = async (id) => {
  return City.findById(id);
};

/**
 * Update City by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<City>}
 */
const updateCityById = async (id, updateBody) => {
  const user = await getCityById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<City>}
 */
const deleteCityById = async (id) => {
  const user = await getCityById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
  }
  await user.remove();
  return user;
};

const findCities = async (country_name, state_name, limit, page) => {
    const filter = {};
    if (country_name) filter.country_name = country_name;
    if (state_name) filter.state_name = state_name;
  
    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
    };
  
    const result = await City.paginate(filter, options); // Using the `paginate` plugin
    return result;
  };

module.exports = {
  createCity,
  queryCity,
  getCityById,
  updateCityById,
  deleteCityById,
  findCities,
};
