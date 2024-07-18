const httpStatus = require('http-status');
const { Elastic } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Elastic
 * @param {Object} reqBody
 * @returns {Promise<Elastic>}
 */
const createElastic = async (reqBody) => {
  return Elastic.create(reqBody);
};

/**
 * Query for Elastic
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryElastic = async (filter, options) => {
  const Elastic = await Elastic.paginate(filter, options);
  return Elastic;
};

/**
 * Get Elastic by id
 * @param {ObjectId} id
 * @returns {Promise<Elastic>}
 */
const getElasticById = async (id) => {
  return Elastic.findById(id);
};

/**
 * Update Elastic by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Elastic>}
 */
const updateElasticById = async (id, updateBody) => {
  const user = await getElasticById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Elastic not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Elastic>}
 */
const deleteElasticById = async (id) => {
  const user = await getElasticById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Elastic not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createElastic,
  queryElastic,
  getElasticById,
  updateElasticById,
  deleteElasticById,
};
