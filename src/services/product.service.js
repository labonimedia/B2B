
const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * fileupload
 * @param {Object} reqBody
 * @returns {Promise<Product>}
 */

const fileupload = async(req, productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const { colour, colourName } = req.body;
    const colourImage = req.uploadedFiles.shift();
    const productImages = req.uploadedFiles.splice(0, req.files['productImages'] ? req.files['productImages'].length : 0);
    const productVideo = req.uploadedFiles.pop();

    const newColourCollection = {
      colour,
      colourName,
      colourImage,
      productImages,
      productVideo
    };

    product.colourCollections.push(newColourCollection);
    return await product.save();

}
/**
 * Create a Product
 * @param {Object} reqBody
 * @returns {Promise<Product>}
 */
const createProduct = async (reqBody) => {
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
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
    fileupload,
  createProduct,
  queryProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
