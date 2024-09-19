const httpStatus = require('http-status');
const { Mapping } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Material
 * @param {Object} reqBody
 * @returns {Promise<Material>}
 */
const createMapping = async (reqBody) => {
  return Mapping.create(reqBody);
};

/**
 * Query for Material
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMapping = async (filter, options) => {
  const material = await Mapping.paginate(filter, options);
  return material;
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getMappingById = async (id) => {
  return Mapping.findById(id);
};


/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getMappingByQuery = async (productType,gender,category, subCategory) => {
  return Mapping.find({productType,gender,category, subCategory});
};

/**
 * Update Material by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Material>}
 */
const updateMappingById = async (id, updateBody) => {
  const user = await getMappingById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mapping not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Material>}
 */
const deleteMappingById = async (id) => {
  const user = await getMappingById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mapping not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createMapping,
  queryMapping,
  getMappingById,
  getMappingByQuery,
  updateMappingById,
  deleteMappingById,
};
