const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * fileupload
 * @param {Object} reqBody
 * @returns {Promise<Product>}
 */
// const fileupload = async (req, productId) => {
//   const product = await Product.findById(productId);

//   if (!product) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
//   }

//   const { colour, colourName } = req.body;

//   // Extract file paths from req.body
//   const colourImage = req.body.colourImage ? req.body.colourImage[0] : null;
//   const productImages = req.body.productImages || [];
//   const productVideo = req.body.productVideo ? req.body.productVideo[0] : null;

//   const newColourCollection = {
//     colour,
//     colourName,
//     colourImage,
//     productImages,
//     productVideo
//   };

//   product.colourCollections.push(newColourCollection);
//   return await product.save();
// };
const fileupload = async (req, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const { colour, colourName } = req.body;

  // Helper function to extract path from URL
  const extractPath = (url) => new URL(url).pathname;

  // Extract and trim file paths from req.body
  const colourImage = req.body.colourImage ? extractPath(req.body.colourImage[0]) : null;
  const productImages = req.body.productImages ? req.body.productImages.map(extractPath) : [];
  const productVideo = req.body.productVideo ? extractPath(req.body.productVideo[0]) : null;

  const newColourCollection = {
    colour,
    colourName,
    colourImage,
    productImages,
    productVideo,
  };

  product.colourCollections.push(newColourCollection);
  return await product.save();
};

/**
 * Create a Product
 * @param {Object} reqBody
 * @returns {Promise<Product>}
 */
const createProduct = async (reqBody) => {
  const product = await Product.find();
  return Product.create(reqBody);
};

/**
 * Query for Product
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProduct = async (filter, options) => {
  const Products = await Product.paginate(filter, options);
  return Products;
};

/**
 * Query for products
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options (e.g., pagination)
 * @returns {Promise<QueryResult>}
 */
const searchProducts = async (filter, options) => {
  // If there's a search term, add a text search condition
  if (filter.search) {
    filter.$text = { $search: filter.search };
    delete filter.search;
  }

  const products = await Product.paginate(filter, options);
  return products;
};
/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Update Product by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (id, updateBody) => {
  const user = await getProductById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (id) => {
  const user = await getProductById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  fileupload,
  createProduct,
  queryProduct,
  searchProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
