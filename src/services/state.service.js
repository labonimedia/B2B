const httpStatus = require('http-status');
const { State } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a State
 * @param {Object} reqBody
 * @returns {Promise<State>}
 */
const createState = async (reqBody) => {
  return State.create(reqBody);
};

/**
 * Query for State
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryState = async (filter, options) => {
  const states = await State.paginate(filter, options);
  return states;
};

/**
 * Get State by id
 * @param {ObjectId} id
 * @returns {Promise<State>}
 */
const getStateById = async (id) => {
  return State.findById(id);
};

/**
 * Update State by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<State>}
 */
const updateStateById = async (id, updateBody) => {
  const user = await getStateById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<State>}
 */
const deleteStateById = async (id) => {
  const user = await getStateById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  await user.remove();
  return user;
};

const findStates = async (country_name, limit, page) => {
  const filter = {};
  if (country_name) filter.country_name = country_name;

  const options = {
    // limit: parseInt(limit, 10),
    // page: parseInt(page, 10),
    sort: { name: 1 },
  };

  const result = await State.paginate(filter, options); // Using the `paginate` plugin
  return result;
};

module.exports = {
  createState,
  queryState,
  getStateById,
  updateStateById,
  deleteStateById,
  findStates,
};
