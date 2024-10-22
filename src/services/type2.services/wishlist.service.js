const httpStatus = require('http-status');
const { WishListType2Schema, Product, User } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a WishListType2SchemaType2Schema
 * @param {Object} reqBody
 * @returns {Promise<WishListType2SchemaType2Schema>}
 */
const createWishListType2Schema = async (reqBody) => {
  return WishListType2Schema.create(reqBody);
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
  const WishListType2Schemas = await WishListType2Schema.paginate(filter, options);
  return WishListType2Schemas;
};

/**
 * Get WishListType2Schema by id
 * @param {ObjectId} id
 * @returns {Promise<WishListType2Schema>}
 */
const getWishListType2SchemaById = async (id) => {
  return WishListType2Schema.findById(id);
};

const getWishListType2SchemaByEmail = async (email) => {
  const WishListType2SchemaItems = await WishListType2Schema.find({ email }).select('productId _id');
  const productIds = WishListType2SchemaItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const userEmails = [...new Set(products.map((product) => product.productBy))];
  const users = await User.find({ email: { $in: userEmails } });
  const userMap = new Map(users.map((user) => [user.email, user.fullName]));
  const productsWithManufactureName = products.map((product) => {
    const manufactureName = userMap.get(product.productBy) || 'Unknown';
    // const manufactureName = users.fullName || 'Unknown';
    return {
      ...product.toObject(),
      manufactureName,
      WishListType2SchemaId: WishListType2SchemaItems.find((item) => item.productId.toString() === product._id.toString())._id,
    };
  });
  return productsWithManufactureName;
};

/**
 * Get WishListType2Schema by id
 * @param {ObjectId} productId
 * @param {ObjectId} email
 * @returns {Promise<WishListType2Schema>}
 */
const checkWishListType2SchemaById = async (productId, email) => {
  return WishListType2Schema.findOne({ productId, email });
};
/**
 * Update WishListType2Schema by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WishListType2Schema>}
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
 * @returns {Promise<WishListType2Schema>}
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
