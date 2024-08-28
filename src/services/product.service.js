const httpStatus = require('http-status');
const { Product, Manufacture} = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteFile } = require('../utils/upload');

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

/**
 * Update Product by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateColorCollection = async (req, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const { colour, colourName } = req.body;
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
  console.log(req.query.collectionId);
  // Find the existing collection and update it
  const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === req.query.collectionId);
  if (collectionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
  }

  product.colourCollections[collectionIndex] = newColourCollection;
  return await product.save();
};
/**
 * Delete user by id
 * @param {ObjectId} Id
 * @returns {Promise<Product>}
 */
const deleteColorCollection = async (productId, collectionId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === collectionId);
  if (collectionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
  }

  const collection = product.colourCollections[collectionIndex];

  // Delete files from S3
  if (collection.colourImage) {
    await deleteFile(collection.colourImage);
  }
  if (collection.productImages && collection.productImages.length > 0) {
    await Promise.all(collection.productImages.map((image) => deleteFile(image)));
  }
  if (collection.productVideo) {
    await deleteFile(collection.productVideo);
  }

  product.colourCollections.splice(collectionIndex, 1);
  await product.save();
};

const filterProductsAndFetchManufactureDetails = async (filters) => {
  const query = {};
  if (filters.productType) {
    query.productType = filters.productType;
  }
  if (filters.gender) {
    query.gender = filters.gender;
  }
  if (filters.clothing) {
    query.clothing = filters.clothing;
  }
  if (filters.subCategory) {
    query.subCategory = filters.subCategory;
  }
  if (filters.productTitle) {
    query.productTitle = { $regex: filters.productTitle, $options: 'i' };
  }
  if (filters.country) {
    query.country = filters.country;
  }
  if (filters.city) {
    query.city = filters.city;
  }
  if (filters.state) {
    query.state = filters.state;
  }
  const products = await Product.find(query);
  
  if (products.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
  }
  const manufacturerEmails = products.map((product) => product.productBy);
  const manufacturers = await Manufacture.find({ email: { $in: manufacturerEmails } });

  if (manufacturers.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No manufacturer details found');
  }
  return { manufacturers };
};

module.exports = {
  fileupload,
  createProduct,
  queryProduct,
  searchProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  deleteColorCollection,
  updateColorCollection,
  filterProductsAndFetchManufactureDetails
};
