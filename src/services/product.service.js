const httpStatus = require('http-status');
const { Product, Manufacture, User, Request, Brand } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteFile } = require('../utils/upload');

/**
 * fileupload
 * @param {Object} reqBody
 * @returns {Promise<Product>}
 */
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
  return product.save(); // Removed redundant await
};

/**
 * Create a Product
 * @param {Object} reqBody
 * @returns {Promise<Product>}
 */
const createProduct = async (reqBody) => {
  if (reqBody.quantity) reqBody.initialQTY = reqBody.quantity;
  return Product.create(reqBody);
};

const addProduct = async (userId, productData) => {
  const user = await User.findById(userId).populate('subscriptionId');

  const subscription = user.subscriptionId;

  // Check if the subscription is active and hasn't expired
  if (subscription.status === 'expired' || new Date() > subscription.endDate) {
    throw new Error('Subscription expired, please renew');
  }

  // Check product limit
  if (subscription.productsUsed >= subscription.productLimit) {
    throw new Error('Product limit reached, please purchase more product slots');
  }

  // Add new product
  const newProduct = new Product({ ...productData, userId, subscriptionId: subscription._id });
  await newProduct.save();

  // Update the number of products used in the subscription
  subscription.productsUsed += 1;
  await subscription.save();

  return newProduct;
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
  // eslint-disable-next-line no-param-reassign
  if (filter.search) {
    // eslint-disable-next-line no-param-reassign
    filter.$text = { $search: filter.search };
    // eslint-disable-next-line no-param-reassign
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
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductBydesigneNo = async (designNumber, productBy) => {
  return Product.findOne({ designNumber, productBy });
};

/**
 * Update Product by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (id, updateBody) => {
  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (updateBody.newQuantity !== undefined) {
    const updatedDate = updateBody.updatedDate ? updateBody.updatedDate : new Date();

    if (updateBody.newQuantity < 0 && product.quantity + updateBody.newQuantity < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity cannot be negative');
    }
    product.quantitySummary.push({
      newQuantity: updateBody.newQuantity,
      updatedDate,
    });
    product.quantity += Number(updateBody.newQuantity);
  }

  const fieldsToUpdate = { ...updateBody };
  delete fieldsToUpdate.newQuantity;
  delete fieldsToUpdate.updatedDate;

  Object.assign(product, fieldsToUpdate);
  await product.save();
  return product;
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

  // Find the existing collection and update it
  const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === req.query.collectionId);
  if (collectionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
  }

  const collectionToUpdate = product.colourCollections[collectionIndex];

  // Update only the fields that are provided
  if (colour) collectionToUpdate.colour = colour;
  if (colourName) collectionToUpdate.colourName = colourName;
  if (colourImage) collectionToUpdate.colourImage = colourImage;
  if (productImages.length > 0) collectionToUpdate.productImages = productImages;
  if (productVideo) collectionToUpdate.productVideo = productVideo;

  product.colourCollections[collectionIndex] = collectionToUpdate;

  return product.save();
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

// /**
//  * Filter products and fetch manufacturer details
//  * @param {Object} filters
//  * @returns {Promise<Object[]>}
//  */
// const filterProductsAndFetchManufactureDetails = async (filters) => {
//   const query = {};

//   // Build the query based on the filters provided
//   // eslint-disable-next-line no-param-reassign
//   if (filters.productType) {
//     query.productType = filters.productType;
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.gender) {
//     query.gender = filters.gender;
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.clothing) {
//     query.clothing = filters.clothing;
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.subCategory) {
//     query.subCategory = filters.subCategory;
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.productTitle) {
//     query.productTitle = { $regex: filters.productTitle, $options: 'i' };
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.country) {
//     query.country = filters.country;
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.city) {
//     query.city = filters.city;
//   }
//   // eslint-disable-next-line no-param-reassign
//   if (filters.state) {
//     query.state = filters.state;
//   }

//   // Get filtered products
//   const products = await Product.find(query);

//   // Fetch manufacturer details for each product
//   const productManufacturers = await Promise.all(
//     products.map(async (product) => {
//       const manufacturer = await Manufacture.findOne({ email: product.productBy });
//       return {
//         product,
//         manufacturer,
//       };
//     })
//   );

//   return productManufacturers;
// };

// const filterProductsAndFetchManufactureDetails = async (filters) => {
//   const query = {};

//   // Build the query based on the filters provided
//   if (filters.productType) {
//     query.productType = filters.productType;
//   }
//   if (filters.gender) {
//     query.gender = filters.gender;
//   }
//   if (filters.clothing) {
//     query.clothing = filters.clothing;
//   }
//   if (filters.subCategory) {
//     query.subCategory = filters.subCategory;
//   }
//   if (filters.productTitle) {
//     query.productTitle = { $regex: filters.productTitle, $options: 'i' };
//   }
//   if (filters.country) {
//     query.country = filters.country;
//   }
//   if (filters.city) {
//     query.city = filters.city;
//   }
//   if (filters.state) {
//     query.state = filters.state;
//   }

//   // Get filtered products
//   const products = await Product.find(query);

//   // Fetch manufacturer, brand, and request details for each product
//   const productDetails = await Promise.all(
//     products.map(async (product) => {
//       // Fetch manufacturer details
//       const manufacturer = await Manufacture.findOne({ email: product.productBy });

//       // Fetch brand details by productBy
//       const brand = await Brand.findOne({ brandOwner: product.productBy });

//       // Fetch request details by both email and requestByEmail
//       const requestDetails = await Request.findOne({
//         email: product.productBy, // Match product's productBy email
//         requestByEmail: filters.requestByEmail, // Match filters requestByEmail
//       });

//       return {
//         product,
//         manufacturer,
//         brand, // Include the brand object
//         requestDetails, // Include the requestDetails object
//       };
//     })
//   );

//   return productDetails;
// };
const filterProductsAndFetchManufactureDetails = async (filters) => {
  const query = {};

  // Build the query based on the filters provided
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

  // Get filtered products
  const products = await Product.find(query);

  // Fetch manufacturer, brand, and request details for each product
  const productDetails = await Promise.all(
    products.map(async (product) => {
      // Fetch manufacturer details
      const manufacturer = await Manufacture.findOne({ email: product.productBy });

      // Fetch brand details by productBy
      const brand = await Brand.findOne({ brandOwner: product.productBy });

      // Fetch request details by both email and requestByEmail
      const requestDetails = await Request.findOne({
        email: product.productBy, // Match product's productBy email
        requestByEmail: filters.requestByEmail, // Match filters requestByEmail
      });

      // Only include request if status is not 'accepted'
      if (requestDetails && requestDetails.status === 'accepted') {
        return null; // Skip this product if the request is accepted
      }

      return {
        product,
        manufacturer,
        brand, // Include the brand object
        requestDetails, // Include the requestDetails object
      };
    })
  );

  // Filter out null results (where the request was 'accepted')
  return productDetails.filter((detail) => detail !== null);
};

module.exports = {
  fileupload,
  createProduct,
  queryProduct,
  searchProducts,
  getProductById,
  getProductBydesigneNo,
  updateProductById,
  deleteProductById,
  updateColorCollection,
  deleteColorCollection,
  filterProductsAndFetchManufactureDetails,
};
