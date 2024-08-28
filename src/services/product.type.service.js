const httpStatus = require('http-status');
const { ProductType } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ProductType
 * @param {Object} reqBody
 * @returns {Promise<ProductType>}
 */
const createProductType = async (reqBody) => {
  return ProductType.create(reqBody);
};

/**
 * Query for ProductType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProductType = async (filter, options) => {
  const productType = await ProductType.paginate(filter, options);
  return productType;
};

/**
 * Get ProductType by id
 * @param {ObjectId} id
 * @returns {Promise<ProductType>}
 */
const getProductTypeById = async (id) => {
  return ProductType.findById(id);
};

/**
 * Update ProductType by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ProductType>}
 */
const updateProductTypeById = async (id, updateBody) => {
  const user = await getProductTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductType not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<ProductType>}
 */
const deleteProductTypeById = async (id) => {
  const user = await getProductTypeById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductType not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createProductType,
  queryProductType,
  getProductTypeById,
  updateProductTypeById,
  deleteProductTypeById,
};
