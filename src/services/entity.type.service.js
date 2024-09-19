const httpStatus = require('http-status');
const { Entity } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Entity
 * @param {Object} reqBody
 * @returns {Promise<Entity>}
 */
const createEntity = async (reqBody) => {
  return Entity.create(reqBody);
};

/**
 * Query for Entity
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEntity = async (filter, options) => {
  const entitys = await Entity.paginate(filter, options);
  return entitys;
};

/**
 * Get Entity by id
 * @param {ObjectId} id
 * @returns {Promise<Entity>}
 */
const getEntityById = async (id) => {
  return Entity.findById(id);
};

/**
 * Update Entity by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Entity>}
 */
const updateEntityById = async (id, updateBody) => {
  const user = await getEntityById(id);
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
 * @returns {Promise<Entity>}
 */
const deleteEntityById = async (id) => {
  const user = await getEntityById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createEntity,
  queryEntity,
  getEntityById,
  updateEntityById,
  deleteEntityById,
};
