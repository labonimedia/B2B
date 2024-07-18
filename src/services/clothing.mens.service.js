const httpStatus = require('http-status');
const { ClothingMens } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ClothingMens
 * @param {Object} reqBody
 * @returns {Promise<ClothingMens>}
 */
const createClothingMens = async (reqBody) => {
  return ClothingMens.create(reqBody);
};

/**
 * Query for ClothingMens
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClothingMens = async (filter, options) => {
  const clothingMens = await ClothingMens.paginate(filter, options);
  return clothingMens;
};

/**
 * Get ClothingMens by id
 * @param {ObjectId} id
 * @returns {Promise<ClothingMens>}
 */
const getClothingMensById = async (id) => {
  return ClothingMens.findById(id);
};

/**
 * Update ClothingMens by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ClothingMens>}
 */
const updateClothingMensById = async (id, updateBody) => {
  const user = await getClothingMensById(id);
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
 * @returns {Promise<ClothingMens>}
 */
const deleteClothingMensById = async (id) => {
  const user = await getClothingMensById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createClothingMens,
  queryClothingMens,
  getClothingMensById,
  updateClothingMensById,
  deleteClothingMensById,
};
