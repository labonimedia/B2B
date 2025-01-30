const httpStatus = require('http-status');
const { ProductType2, Manufacture, User, WholesalerPriceType2, Brand, Request } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { deleteFile } = require('../../utils/upload');

/**
 * fileupload
 * @param {Object} reqBody
 * @returns {Promise<ProductType2>}
 */
const fileupload = async (req, productId) => {
  const product = await ProductType2.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductType2 not found');
  }

  const { colour, colourName, colourImage, productImages, productVideo } = req.body;

  const newColourCollection = {
    colour,
    colourName,
    colourImage: colourImage ? colourImage[0] : null, // Save as-is
    productImages: productImages || [], // Save as-is
    productVideo: productVideo ? productVideo[0] : null, // Save as-is
  };

  product.colourCollections.push(newColourCollection);
  return product.save(); // Save the updated product
};

/**
 * Create a ProductType2
 * @param {Object} reqBody
 * @returns {Promise<ProductType2>}
 */
const createProduct = async (reqBody) => {
  if (reqBody.quantity) reqBody.initialQTY = reqBody.quantity;
  return ProductType2.create(reqBody);
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
  const newProduct = new ProductType2({ ...productData, userId, subscriptionId: subscription._id });
  await newProduct.save();

  // Update the number of products used in the subscription
  subscription.productsUsed += 1;
  await subscription.save();

  return newProduct;
};

/**
 * Query for ProductType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProduct = async (filter, options) => {
  const Products = await ProductType2.paginate(filter, options);
  return Products;
};

/**
 * Query for products
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options (e.g., pagination)
 * @returns {Promise<QueryResult>}
 */
const searchProducts = async (filter, options) => {
  if (filter.search) {
    filter.$text = { $search: filter.search }; // Add text search condition if search term is present
    delete filter.search;
  }

  const products = await ProductType2.paginate(filter, options); // Paginate with the filtered criteria
  return products;
};

const searchForWSProducts = async (filter, options, WholesalerEmail) => {
  // If there's a search term, add a text search condition
  if (filter.search) {
    filter.$text = { $search: filter.search };
    delete filter.search;
  }

  // Fetch products with pagination
  const products = await ProductType2.paginate(filter, options);

  // Fetch wholesaler prices by WholesalerEmail
  const wholesalerPrices = await WholesalerPriceType2.find({ WholesalerEmail }).select('productId');

  // Extract productIds from wholesalerPrices
  const productIdsWithPrice = new Set(wholesalerPrices.map((price) => price.productId.toString()));

  // Add status to each product in the results
  const resultsWithStatus = products.results.map((product) => ({
    ...product.toJSON(),
    status: productIdsWithPrice.has(product._id.toString()) ? 'Done' : 'Pending',
  }));

  // Return the modified results along with other pagination details
  return {
    ...products,
    results: resultsWithStatus,
  };
};

/**
 * Get ProductType2 by id
 * @param {ObjectId} id
 * @returns {Promise<ProductType2>}
 */
const getProductById = async (id) => {
  return ProductType2.findById(id);
};

/**
 * Get ProductType2 by id
 * @param {ObjectId} id
 * @returns {Promise<ProductType2>}
 */
const getProductBydesigneNo = async (designNumber, productBy) => {
  return ProductType2.findOne({ designNumber, productBy });
};

/**
 * Update ProductType2 by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ProductType2>}
 */
const updateProductById = async (id, updateBody) => {
  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  Object.assign(product, updateBody);
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
 * Update ProductType2 by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ProductType2>}
 */
const updateColorCollection = async (req, productId) => {
  const uploadedFiles = []; // To track uploaded files for cleanup
  try {
    const product = await ProductType2.findById(productId);

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // const { colour, colourName } = req.body;

    const { colour, colourName, colourImage, productImages, productVideo } = req.body;

    // Track uploaded files for rollback
    if (colourImage) uploadedFiles.push(colourImage);
    if (productImages && productImages.length > 0) uploadedFiles.push(...productImages);
    if (productVideo) uploadedFiles.push(productVideo);

    const newColourCollection = {
      colour,
      colourName,
      colourImage: colourImage ? colourImage[0] : null, // Save as-is
      productImages: productImages || [], // Save as-is
      productVideo: productVideo ? productVideo[0] : null, // Save as-is
    };

    // Find the existing collection and update it
    const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === req.query.collectionId);

    if (collectionIndex === -1) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
    }

    // Update the collection
    product.colourCollections[collectionIndex] = newColourCollection;

    // Save the product
    await product.save();
  } catch (err) {
    console.error('Error occurred:', err.message);

    // Rollback: Delete uploaded files
    try {
      if (uploadedFiles.length > 0) {
        console.log('Rolling back uploaded files:', uploadedFiles);
        await Promise.all(uploadedFiles.map((file) => deleteFile(file)));
      }
    } catch (deleteErr) {
      console.error('Error during rollback:', deleteErr.message);
    }

    // Re-throw the original error
    throw err;
  }
};

// const updateColorCollection = async (req, productId) => {
//   const product = await ProductType2.findById(productId);

//   if (!product) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
//   }

//   const { colour, colourName } = req.body;
//   const extractPath = (url) => new URL(url).pathname;

//   // Extract and trim file paths from req.body
//   const colourImage = req.body.colourImage ? extractPath(req.body.colourImage[0]) : null;
//   const productImages = req.body.productImages ? req.body.productImages.map(extractPath) : [];
//   const productVideo = req.body.productVideo ? extractPath(req.body.productVideo[0]) : null;

//   const newColourCollection = {
//     colour,
//     colourName,
//     colourImage,
//     productImages,
//     productVideo,
//   };

//   const collectionIndex = product.colourCollections.findIndex(
//     (c) => c._id.toString() === req.query.collectionId
//   );

//   if (collectionIndex === -1) {
//     try {
//       // Attempt to delete uploaded files
//       if (colourImage) {
//         await deleteFile(colourImage);
//       }
//       if (productImages && productImages.length > 0) {
//         await Promise.all(productImages.map((image) => deleteFile(image)));
//       }
//       if (productVideo) {
//         await deleteFile(productVideo);
//       }
//     } catch (deleteError) {
//       console.error('Error deleting files:', deleteError.message);
//     }

//     // Throw the error after cleanup
//     throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
//   }

//   // Update the existing collection
//   product.colourCollections[collectionIndex] = newColourCollection;

//   return product.save();
// };

const updateProductVideo = async (req, productId) => {
  try {
    const { productVideo } = req.body;
    const { collectionId } = req.query;

    if (!productVideo || !productVideo[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No video provided');
    }

    const product = await ProductType2.findOneAndUpdate(
      { _id: productId, 'colourCollections._id': collectionId },
      { $set: { 'colourCollections.$.productVideo': productVideo[0] } },
      { new: true }
    );

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product or Colour Collection not found');
    }

    return product;
  } catch (err) {
    console.error('Error updating product video:', err.message);
    throw err;
  }
};



/**
 * Delete user by id
 * @param {ObjectId} Id
 * @returns {Promise<ProductType2>}
 */
const deleteColorCollection = async (productId, collectionId) => {
  const product = await ProductType2.findById(productId);

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

/**
 * Filter products and fetch manufacturer details
 * @param {Object} filters
 * @returns {Promise<Object[]>}
 */
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
//   const products = await ProductType2.find(query);

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
  const products = await ProductType2.find(query);

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
const checkProductExistence = async (designNumber, brand) => {
  const product = await ProductType2.findOne({ designNumber, brand });
  return product;
};
module.exports = {
  fileupload,
  createProduct,
  queryProduct,
  searchProducts,
  searchForWSProducts,
  getProductById,
  getProductBydesigneNo,
  updateProductById,
  deleteProductById,
  updateColorCollection,
  updateProductVideo,
  deleteColorCollection,
  filterProductsAndFetchManufactureDetails,
  checkProductExistence,
};
