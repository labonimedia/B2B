const httpStatus = require('http-status');
const { CartType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

// /**
//  * Create a CartType2
//  * @param {Object} reqBody - Contains the array of items
//  * @returns {Promise<CartType2>}
//  */
// const createCartType2 = async (reqBody) => {
//   // Ensure that reqBody contains an array of items
//   if (!Array.isArray(reqBody.sizes)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Sizes must be an array');
//   }

//   // Create a new cart with the provided sizes
//   return CartType2.create(reqBody);
// };

/**
 * Create multiple CartType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<CartType2>>}
 */
const createCartType2 = async (reqBody) => {
    // Ensure that reqBody is an array
    if (!Array.isArray(reqBody)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be an array of items');
    }
  
    // Validate each item in the array
    reqBody.forEach(item => {
      if (!item.colourHex || !item.colourImage || !item.colourName || !Array.isArray(item.sizes)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Each item must have colourHex, colourImage, colourName, and sizes');
      }
    });
  
    // Create multiple CartType2 items
    const createdItems = await CartType2.insertMany(reqBody);
    return createdItems;
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
