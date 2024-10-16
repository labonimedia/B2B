const httpStatus = require('http-status');
const { CartType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple CartType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<CartType2>>}
 */
const createCartType2 = async (reqBody) => {
  return CartType2.create(reqBody);
};

/**
 * Query for CartType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCartType2 = async (filter, options) => {
  const cartType2Items = await CartType2.paginate(filter, options);
  return cartType2Items;
};

/**
 * Get CartType2 by id
 * @param {ObjectId} id
 * @returns {Promise<CartType2>}
 */
const getCartType2ById = async (id) => {
  return CartType2.findById(id);
};

/**
 * Update CartType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<CartType2>}
 */
const updateCartType2ById = async (id, updateBody) => {
  const cart = await getCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete CartType2 by id
 * @param {ObjectId} id
 * @returns {Promise<CartType2>}
 */
const deleteCartType2ById = async (id) => {
  const cart = await getCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await cart.remove();
  return cart;
};

module.exports = {
  createCartType2,
  queryCartType2,
  getCartType2ById,
  updateCartType2ById,
  deleteCartType2ById,
};


