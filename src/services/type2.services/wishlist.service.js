const httpStatus = require('http-status');
const { WishListType2, ProductType2, User } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a WishListType2SchemaType2Schema
 * @param {Object} reqBody
 * @returns {Promise<WishListType2>}
 */
const createWishListType2Schema = async (reqBody) => {
  return WishListType2.create(reqBody);
};

/**
 * Query for WishListType2Schema
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWishListType2Schema = async (filter, options) => {
  const wishListType2 = await WishListType2.paginate(filter, options);
  return wishListType2;
};

/**
 * Get WishListType2Schema by id
 * @param {ObjectId} id
 * @returns {Promise<WishListType2>}
 */
const getWishListType2SchemaById = async (id) => {
  return WishListType2.findById(id);
};

const getWishListType2SchemaByEmail = async (email) => {
  try {
    // Fetch wishlisted items and extract product IDs
    const wishListItems = await WishListType2.find({ email }).select('productId _id').lean();
    if (!wishListItems.length) return [];

    const productIds = wishListItems.map((item) => item.productId);

    // Fetch products in a single query
    const products = await ProductType2.find({ _id: { $in: productIds } }).lean();
    if (!products.length) return [];

    // Extract unique manufacturer emails
    const userEmails = [...new Set(products.map((product) => product.productBy))];

    // Fetch manufacturer details in a single query
    const users = await User.find({ email: { $in: userEmails } }).select('email fullName').lean();

    // Create a map for quick lookup
    const userMap = new Map(users.map((user) => [user.email, user.fullName]));

    // Create a map for wishlist items lookup
    const wishListMap = new Map(wishListItems.map((item) => [item.productId.toString(), item._id]));

    // Combine data
    return products.map((product) => ({
      ...product,
      manufactureName: userMap.get(product.productBy) || 'Unknown',
      WishListType2SchemaId: wishListMap.get(product._id.toString()) || null,
    }));
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    throw new Error('Failed to fetch wishlist data');
  }
};

/**
 * Get WishListType2Schema by id
 * @param {ObjectId} productId
 * @param {ObjectId} email
 * @returns {Promise<WishListType2>}
 */
const checkWishListType2SchemaById = async (productId, email, productOwnerEmail) => {
  return WishListType2.findOne({ productId, email, productOwnerEmail });
};

/**
 * Update WishListType2Schema by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WishListType2>}
 */
const updateWishListType2SchemaById = async (id, updateBody) => {
  const user = await getWishListType2SchemaById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WishListType2Schema not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<WishListType2>}
 */
const deleteWishListType2SchemaById = async (id) => {
  const user = await getWishListType2SchemaById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WishListType2Schema not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createWishListType2Schema,
  queryWishListType2Schema,
  getWishListType2SchemaById,
  checkWishListType2SchemaById,
  updateWishListType2SchemaById,
  deleteWishListType2SchemaById,
  getWishListType2SchemaByEmail,
};
