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
  const WishListType2SchemaItems = await WishListType2.find({ email }).select('productId _id');
  const productIds = WishListType2SchemaItems.map((item) => item.productId);
  const products = await ProductType2.find({ _id: { $in: productIds } });
  const userEmails = [...new Set(products.map((product) => product.productBy))];
  const users = await User.find({ email: { $in: userEmails } });
  const userMap = new Map(users.map((user) => [user.email, user.fullName]));
  const productsWithManufactureName = products.map((product) => {
    const manufactureName = userMap.get(product.productBy) || 'Unknown';
    // const manufactureName = users.fullName || 'Unknown';
    return {
      ...product.toObject(),
      manufactureName,
      WishListType2SchemaId: WishListType2SchemaItems.find((item) => item.productId.toString() === product._id.toString())
        ._id,
    };
  });
  return productsWithManufactureName;
};

/**
 * Get WishListType2Schema by id
 * @param {ObjectId} productId
 * @param {ObjectId} email
 * @returns {Promise<WishListType2>}
 */
const checkWishListType2SchemaById = async (productId, email) => {
  return WishListType2.findOne({ productId, email });
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
