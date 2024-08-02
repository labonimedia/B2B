const httpStatus = require('http-status');
const { Wishlist, Product, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Wishlist
 * @param {Object} reqBody
 * @returns {Promise<Wishlist>}
 */
const createWishlist = async (reqBody) => {
  return Wishlist.create(reqBody);
};

/**
 * Query for Wishlist
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWishlist = async (filter, options) => {
  const Wishlists = await Wishlist.paginate(filter, options);
  return Wishlists;
};

/**
 * Get Wishlist by id
 * @param {ObjectId} id
 * @returns {Promise<Wishlist>}
 */
const getWishlistById = async (id) => {
  return Wishlist.findById(id);
};

// const getWishlistByEmail = async (email) => {
//     const wishlistItems = await Wishlist.find({ email }).select('productId');
//     const productIds = wishlistItems.map((item) => item.productId);

//     const products = await Product.find({ _id: { $in: productIds } });
//     return products;
//   };
const getWishlistByEmail = async (email) => {
  const wishlistItems = await Wishlist.find({ email }).select('productId');
  const productIds = wishlistItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const userEmails = [...new Set(products.map((product) => product.productBy))];
  const users = await User.find({ email: { $in: userEmails } });
  const userMap = new Map(users.map((user) => [user.email, user.fullName]));
  const productsWithManufactureName = products.map((product) => {
    const manufactureName = users.get(product.productBy) || 'Unknown';
    // const manufactureName = users.fullName || 'Unknown';
    return {
      ...product.toObject(),
      manufactureName,
    };
  });
  return productsWithManufactureName;
};

/**
 * Get Wishlist by id
 * @param {ObjectId} productId
 * @param {ObjectId} email
 * @returns {Promise<Wishlist>}
 */
const checkWishlistById = async (productId, email) => {
  return Wishlist.findOne({ productId, email });
};
/**
 * Update Wishlist by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Wishlist>}
 */
const updateWishlistById = async (id, updateBody) => {
  const user = await getWishlistById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Wishlist>}
 */
const deleteWishlistById = async (id) => {
  const user = await getWishlistById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWishlist,
  queryWishlist,
  getWishlistById,
  getWishlistByEmail,
  checkWishlistById,
  updateWishlistById,
  deleteWishlistById,
};
