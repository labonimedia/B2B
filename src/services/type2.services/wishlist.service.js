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

// const getWishListType2SchemaByEmail = async (email) => {
//   const WishListType2SchemaItems = await WishListType2.find({ email }).select('productId _id');
//   const productIds = WishListType2SchemaItems.map((item) => item.productId);
//   const products = await ProductType2.find({ _id: { $in: productIds } });
//   const userEmails = [...new Set(products.map((product) => product.productBy))];
//   const users = await User.find({ email: { $in: userEmails } });
//   const userMap = new Map(users.map((user) => [user.email, user.fullName]));
//   const productsWithManufactureName = products.map((product) => {
//     const manufactureName = userMap.get(product.productBy) || 'Unknown';
//     // const manufactureName = users.fullName || 'Unknown';
//     return {
//       ...product.toObject(),
//       manufactureName,
//       WishListType2SchemaId: WishListType2SchemaItems.find((item) => item.productId.toString() === product._id.toString())
//         ._id,
//     };
//   });
//   return productsWithManufactureName;
// };

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

// /**
//  * Get WishListType2Schema by email
//  * @param {String} email
//  * @returns {Promise<Array>}
//  */
// const getWishListType2SchemaByEmail = async (email) => {
//   // Get all wishlist items for the provided email
//   const wishListItems = await WishListType2.find({ email }).select('productId _id productOwnerEmail');

//   // Extract productIds and productOwnerEmails from the wishlist items
//   const productIds = wishListItems.map((item) => item.productId);
//   const productOwnerEmails = wishListItems.map((item) => item.productOwnerEmail);

//   // Fetch products by the extracted productIds
//   const products = await ProductType2.find({ _id: { $in: productIds } });

//   // Fetch users (manufacturers) based on the productOwnerEmails
//   const users = await User.find({ email: { $in: productOwnerEmails } });
//   const userMap = new Map(users.map((user) => [user.email, user.fullName]));

//   // Map products to include manufactureName from userMap and the WishListType2SchemaId
//   const productsWithManufactureName = products.map((product) => {
//     const manufactureName = userMap.get(product.productBy) || 'Unknown';

//     // Get the corresponding WishListType2SchemaId for the product
//     const wishlistItem = wishListItems.find((item) => item.productId.toString() === product._id.toString());

//     return {
//       ...product.toObject(),
//       manufactureName,
//       WishListType2SchemaId: wishlistItem ? wishlistItem._id : null,
//     };
//   });

//   return productsWithManufactureName;
// };
/**
 * Get WishListType2Schema by email
 * @param {String} email
 * @returns {Promise<Array>}
 */
// const getWishListType2SchemaByEmail = async (email) => {
//   // Get all wishlist items for the provided email
//   const wishListItems = await WishListType2.find({ email }).select('productId _id productOwnerEmail productUser');

//   // Extract productIds and productOwnerEmails from the wishlist items
//   const productIds = wishListItems.map((item) => item.productId);
//   const productOwnerEmails = wishListItems.map((item) => item.productOwnerEmail);

//   // Fetch products by the extracted productIds
//   const products = await ProductType2.find({ _id: { $in: productIds } });

//   // Fetch users (manufacturers) based on the productOwnerEmails
//   const users = await User.find({ email: { $in: productOwnerEmails } });
//   const userMap = new Map(users.map((user) => [user.email, user.companyName, user.fullName, user.role]));

//   // Map products to include manufactureName from userMap and the WishListType2SchemaId
//   const productsWithManufactureName = products.map((product) => {
//     const manufactureName = userMap.get(product.productBy) || 'Unknown';

//     // Get the corresponding WishListType2SchemaId for the product and productOwnerEmail
//     const wishlistItem = wishListItems.filter((item) => item.productId.toString() === product._id.toString());

//     return wishlistItem.map(item => ({
//       ...product.toObject(),
//       manufactureName,
//       productOwnerEmail: item.productOwnerEmail,
//       WishListType2SchemaId: item._id,
//       productUser: item.productUser || ''
//     }));
//   });

//   // Flatten the productsWithManufactureName array as we mapped each product to multiple items if productOwnerEmail differs
//   const flattenedProducts = [].concat(...productsWithManufactureName);

//   return flattenedProducts;
// };

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


module.exports = {
  createWishListType2Schema,
  queryWishListType2Schema,
  getWishListType2SchemaById,
  checkWishListType2SchemaById,
  updateWishListType2SchemaById,
  deleteWishListType2SchemaById,
  getWishListType2SchemaByEmail,
};
