const httpStatus = require('http-status');
const { LayerCompression } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a LayerCompression
 * @param {Object} reqBody
 * @returns {Promise<LayerCompression>}
 */
const createLayerCompression = async (reqBody) => {
  return LayerCompression.create(reqBody);
};

/**
 * Query for LayerCompression
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLayerCompression = async (filter, options) => {
  const layerCompression = await LayerCompression.paginate(filter, options);
  return layerCompression;
};

/**
 * Get LayerCompression by id
 * @param {ObjectId} id
 * @returns {Promise<LayerCompression>}
 */
const getLayerCompressionById = async (id) => {
  return LayerCompression.findById(id);
};

/**
 * Update LayerCompression by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<LayerCompression>}
 */
const updateLayerCompressionById = async (id, updateBody) => {
  const user = await getLayerCompressionById(id);
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
 * @returns {Promise<LayerCompression>}
 */
const deleteLayerCompressionById = async (id) => {
  const user = await getLayerCompressionById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createLayerCompression,
  queryLayerCompression,
  getLayerCompressionById,
  updateLayerCompressionById,
  deleteLayerCompressionById,
};
