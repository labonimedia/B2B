const httpStatus = require('http-status');
const { IssuedProducts } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Material
 * @param {Object} reqBody
 * @returns {Promise<Material>}
 */
const createIssuedProducts = async (reqBody) => {
  return IssuedProducts.create(reqBody);
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
const queryIssuedProducts = async (filter, options) => {
  const material = await IssuedProducts.paginate(filter, options);
  return material;
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getIssuedProductsById = async (id) => {
  return IssuedProducts.findById(id);
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getIssuedProductsBycustomerEmail = async (customerEmail) => {
  return IssuedProducts.find({ customerEmail });
};

/**
 * Update Material by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Material>}
 */
const updateIssuedProductsById = async (id, updateBody) => {
  const user = await getIssuedProductsById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IssuedProducts not found');
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
const deleteIssuedProductsById = async (id) => {
  const user = await getIssuedProductsById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IssuedProducts not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createIssuedProducts,
  queryIssuedProducts,
  getIssuedProductsBycustomerEmail,
  getIssuedProductsById,
  updateIssuedProductsById,
  deleteIssuedProductsById,
};
