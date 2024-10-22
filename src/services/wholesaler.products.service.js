const httpStatus = require('http-status');
const { WholesalerProducts, Wholesaler, Request } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * fileupload
 * @param {Object} reqBody
 * @returns {Promise<WholesalerProducts>}
 */

const fileupload = async (req, productId) => {
  const product = await WholesalerProducts.findById(productId);

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
  // eslint-disable-next-line no-return-await
  return await product.save();
};

/**
 * Create a Product
 * @param {Object} reqBody
 * @returns {Promise<WholesalerProducts>}
 */
const createProduct = async (reqBody) => {
  return WholesalerProducts.create(reqBody);
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
  const Products = await WholesalerProducts.paginate(filter, options);
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
    // eslint-disable-next-line no-param-reassign
    filter.$text = { $search: filter.search };
    // eslint-disable-next-line no-param-reassign
    delete filter.search;
  }

  const products = await WholesalerProducts.paginate(filter, options);
  return products;
};
/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerProducts>}
 */
const getProductById = async (id) => {
  return WholesalerProducts.findById(id);
};

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerProducts>}
 */
const getProductByWholealer = async (wholesalerEmail) => {
  return (await WholesalerProducts.find(wholesalerEmail)).select('brand');
};

/**
 * Update Product by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WholesalerProducts>}
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
 * @returns {Promise<WholesalerProducts>}
 */
const deleteProductById = async (id) => {
  const user = await getProductById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await user.remove();
  return user;
};

// /**
//  * Search for wholesaler products by brand and fetch wholesaler details
//  * @param {Object} filter - The filter criteria for searching products
//  * @param {Object} options - Query options (pagination, etc.)
//  * @returns {Promise<Object>} - A paginated result of products with wholesaler details
//  */

// const searchWholesalerProductsByBrand = async (filter, options) => {
//   const products = await WholesalerProducts.paginate(filter, options);
//   // Fetch wholesaler details for each product found
//   const results = await Promise.all(
//     products.docs.map(async (product) => {
//       const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });
//       return {
//         product,
//         wholesaler: wholesaler || null,
//       };
//     })
//   );
//   return {
//     totalDocs: products.totalDocs,
//     limit: products.limit,
//     totalPages: products.totalPages,
//     page: products.page,
//     results,
//   };
// };

/**
 * Search for wholesaler products by brand and fetch wholesaler details
 * @param {Object} filter - The filter criteria for searching products
 * @param {Object} options - Query options (pagination, limit, etc.)
 * @returns {Promise<Object>} - A paginated result of products with wholesaler details
 */

// const searchWholesalerProductsByBrand = async (filter, options) => {
//   // Calculate how many products to skip based on the current page and limit
//   const page = options.page ? parseInt(options.page, 10) : 1;
//   const limit = options.limit ? parseInt(options.limit, 10) : 10;
//   const skip = (page - 1) * limit;

//   // Fetch products based on the filter, limit, and page
//   const products = await WholesalerProducts.find(filter).limit(limit).skip(skip).exec();

//   // Count the total number of documents that match the filter
//   const totalDocs = await WholesalerProducts.countDocuments(filter);

//   // Fetch wholesaler details for each product found
//   const results = await Promise.all(
//     products.map(async (product) => {
//       const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });
//       return {
//         product,
//         wholesaler: wholesaler || null,
//       };
//     })
//   );

//   // Calculate total pages based on the total documents and the limit
//   const totalPages = Math.ceil(totalDocs / limit);

//   // Return the paginated product data along with wholesaler details
//   return {
//     totalDocs,
//     limit,
//     totalPages,
//     page,
//     results,
//   };
// };

// const searchWholesalerProductsByBrand = async (filter, options, requestByEmail) => {
//   // Set pagination defaults
//   const page = options.page ? parseInt(options.page, 10) : 1;
//   const limit = options.limit ? parseInt(options.limit, 10) : 10;
//   const skip = (page - 1) * limit;

//   // Fetch products based on the filter, limit, and pagination
//   const products = await WholesalerProducts.find(filter).limit(limit).skip(skip).exec();

//   // Count the total number of documents that match the filter
//   const totalDocs = await WholesalerProducts.countDocuments(filter);

//   // Fetch wholesaler details and request details for each product
//   const results = await Promise.all(
//     products.map(async (product) => {
//       // Fetch wholesaler details
//       const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });

//       // Fetch request details based on email and requestByEmail from filters
//       const requestDetails = await Request.findOne({
//         email: product.wholesalerEmail,
//         requestByEmail: requestByEmail,  // This is coming from the body or filters
//       });

//       return {
//         product,
//         wholesaler: wholesaler || null,
//         requestDetails: requestDetails || null, // Include requestDetails in the response
//       };
//     })
//   );

//   // Calculate total pages
//   const totalPages = Math.ceil(totalDocs / limit);

//   // Return the paginated product data with wholesaler and request details
//   return {
//     totalDocs,
//     limit,
//     totalPages,
//     page,
//     results,
//   };
// };

const searchWholesalerProductsByBrand = async (filter, options, requestByEmail) => {
  // Set pagination defaults
  const page = options.page ? parseInt(options.page, 10) : 1;
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const skip = (page - 1) * limit;

  // Fetch products based on the filter, limit, and pagination
  const products = await WholesalerProducts.find(filter).limit(limit).skip(skip).exec();

  // Count the total number of documents that match the filter
  const totalDocs = await WholesalerProducts.countDocuments(filter);

  // Fetch wholesaler details and request details for each product
  const results = await Promise.all(
    products.map(async (product) => {
      // Fetch wholesaler details
      const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });

      // Fetch request details based on email and requestByEmail from filters
      const requestDetails = await Request.findOne({
        email: product.wholesalerEmail,
        requestByEmail: requestByEmail,
      });

      // Exclude products where the request status is 'accepted'
      if (requestDetails && requestDetails.status === 'accepted') {
        return null; // Skip this product if the request is accepted
      }

      return {
        product,
        wholesaler: wholesaler || null,
        requestDetails: requestDetails || null,
      };
    })
  );

  // Filter out null results (where the request was 'accepted')
  const filteredResults = results.filter(result => result !== null);

  // Calculate total pages
  const totalPages = Math.ceil(totalDocs / limit);

  // Return the paginated product data with wholesaler and request details
  return {
    totalDocs: filteredResults.length, // Update totalDocs to match filtered results count
    limit,
    totalPages,
    page,
    results: filteredResults,
  };
};

// /**
//  * Filter products based on dynamic filters and fetch wholesaler details
//  * @param {Object} filters - The filter criteria for searching products
//  * @param {Object} options - Query options (pagination, etc.)
//  * @returns {Promise<Object>} - A paginated result of products with wholesaler details
//  */
// const filterWholesalerProducts = async (filters, options) => {
//   // Building dynamic filter for products
//   const productFilter = {};

//   // Apply filters dynamically if they exist
//   if (filters.productType) productFilter.productType = filters.productType;
//   if (filters.gender) productFilter.gender = filters.gender;
//   if (filters.clothing) productFilter.clothing = filters.clothing;
//   if (filters.subCategory) productFilter.subCategory = filters.subCategory;

//   // Fetch filtered products with pagination
//   const products = await WholesalerProducts.paginate(productFilter, options);

//   // Fetch wholesaler details for each filtered product
//   const results = await Promise.all(
//     products.docs.map(async (product) => {
//       const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });
//       return {
//         product,
//         wholesaler: wholesaler || null,
//       };
//     })
//   );

//   // Additional filtering by country, state, city if present
//   let filteredResults = results;
//   if (filters.country) {
//     filteredResults = filteredResults.filter((result) => result.wholesaler?.country === filters.country);
//   }
//   if (filters.state) {
//     filteredResults = filteredResults.filter((result) => result.wholesaler?.state === filters.state);
//   }
//   if (filters.city) {
//     filteredResults = filteredResults.filter((result) => result.wholesaler?.city === filters.city);
//   }

//   return {
//     totalDocs: products.totalDocs,
//     limit: products.limit,
//     totalPages: products.totalPages,
//     page: products.page,
//     results: filteredResults,
//   };
// };

// /**
//  * Filter products based on dynamic filters and fetch wholesaler details
//  * @param {Object} filters - The filter criteria for searching products
//  * @param {Object} options - Query options (pagination, etc.)
//  * @returns {Promise<Object>} - A paginated result of products with wholesaler details
//  */
// const filterWholesalerProducts = async (filters, options) => {
//   // Building dynamic filter for products
//   const productFilter = {};

//   // Apply filters dynamically if they exist
//   if (filters.productType) productFilter.productType = filters.productType;
//   if (filters.gender) productFilter.gender = filters.gender;
//   if (filters.clothing) productFilter.clothing = filters.clothing;
//   if (filters.subCategory) productFilter.subCategory = filters.subCategory;

//   // Handle pagination options
//   const page = options.page ? parseInt(options.page, 10) : 1;
//   const limit = options.limit ? parseInt(options.limit, 10) : 10;
//   const skip = (page - 1) * limit;

//   // Fetch filtered products with pagination
//   const products = await WholesalerProducts.find(productFilter).limit(limit).skip(skip).exec();

//   // Count the total number of products that match the filter
//   const totalDocs = await WholesalerProducts.countDocuments(productFilter);

//   // Fetch wholesaler details for each filtered product
//   const results = await Promise.all(
//     products.map(async (product) => {
//       const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });
//        // Fetch request details based on email and requestByEmail from filters
//        const requestDetails = await Request.findOne({
//         email: product.wholesalerEmail,
//         requestByEmail: filters.requestByEmail,  // This is coming from the body or filters
//       });
//       return {
//         product,
//         wholesaler: wholesaler || null,
//         requestDetails 
//       };
//     })
//   );

//   // Additional filtering by country, state, city if present
//   let filteredResults = results;
//   if (filters.country) {
//     filteredResults = filteredResults.filter((result) => result.wholesaler?.country === filters.country);
//   }
//   if (filters.state) {
//     filteredResults = filteredResults.filter((result) => result.wholesaler?.state === filters.state);
//   }
//   if (filters.city) {
//     filteredResults = filteredResults.filter((result) => result.wholesaler?.city === filters.city);
//   }

//   // Calculate total pages
//   const totalPages = Math.ceil(totalDocs / limit);

//   return {
//     totalDocs,
//     limit,
//     totalPages,
//     page,
//     results: filteredResults,
//   };
// };

/**
 * Filter products based on dynamic filters and fetch wholesaler details
 * @param {Object} filters - The filter criteria for searching products
 * @param {Object} options - Query options (pagination, etc.)
 * @returns {Promise<Object>} - A paginated result of products with wholesaler details
 */
const filterWholesalerProducts = async (filters, options) => {
  // Building dynamic filter for products
  const productFilter = {};

  // Apply filters dynamically if they exist
  if (filters.productType) productFilter.productType = filters.productType;
  if (filters.gender) productFilter.gender = filters.gender;
  if (filters.clothing) productFilter.clothing = filters.clothing;
  if (filters.subCategory) productFilter.subCategory = filters.subCategory;

  // Handle pagination options
  const page = options.page ? parseInt(options.page, 10) : 1;
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const skip = (page - 1) * limit;

  // Fetch filtered products with pagination
  const products = await WholesalerProducts.find(productFilter).limit(limit).skip(skip).exec();

  // Count the total number of products that match the filter
  const totalDocs = await WholesalerProducts.countDocuments(productFilter);

  // Fetch wholesaler details and request details for each filtered product
  const results = await Promise.all(
    products.map(async (product) => {
      const wholesaler = await Wholesaler.findOne({ email: product.wholesalerEmail });

      // Fetch request details based on email and requestByEmail from filters
      const requestDetails = await Request.findOne({
        email: product.wholesalerEmail,
        requestByEmail: filters.requestByEmail,  // This is coming from the body or filters
      });

      // Exclude products where the request status is 'accepted'
      if (requestDetails && requestDetails.status === 'accepted') {
        return null; // Skip this product if the request is accepted
      }

      return {
        product,
        wholesaler: wholesaler || null,
        requestDetails,
      };
    })
  );

  // Remove null entries (i.e., products where request status was 'accepted')
  let filteredResults = results.filter(result => result !== null);

  // Additional filtering by country, state, city if present
  if (filters.country) {
    filteredResults = filteredResults.filter((result) => result.wholesaler?.country === filters.country);
  }
  if (filters.state) {
    filteredResults = filteredResults.filter((result) => result.wholesaler?.state === filters.state);
  }
  if (filters.city) {
    filteredResults = filteredResults.filter((result) => result.wholesaler?.city === filters.city);
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    totalDocs: filteredResults.length, // Update totalDocs to reflect filtered results
    limit,
    totalPages,
    page,
    results: filteredResults,
  };
};

const getUniqueBrandsByEmail = async (wholesalerEmail) => {
  try {
    // Use aggregation to get unique brands for the given wholesalerEmail
    const uniqueBrands = await WholesalerProducts.aggregate([
      {
        $match: { wholesalerEmail }, // Filter by wholesalerEmail
      },
      {
        $group: {
          _id: '$brand', // Group by brand to get unique values
        },
      },
      {
        $project: {
          _id: 0,
          brand: '$_id', // Rename _id to brand
        },
      },
    ]);

    return uniqueBrands;
  } catch (error) {
    throw new Error('Error fetching unique brands: ' + error.message);
  }
};

const productTypeFilter = async (filters, page, limit) => {
  // Build the query object based on the provided filters
  const query = {};

  if (filters.brand) {
    query.brand = filters.brand;
  }
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
  if (filters.wholesalerEmail) {
    query.wholesalerEmail = filters.wholesalerEmail;
  }

  // Set pagination options: skip and limit
  const skip = (page - 1) * limit;

  // Fetch the filtered and paginated results from the database
  const products = await WholesalerProducts.find(query).skip(skip).limit(limit);

  return products;
};

module.exports = {
  fileupload,
  getProductByWholealer,
  createProduct,
  queryProduct,
  searchProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchWholesalerProductsByBrand,
  filterWholesalerProducts,
  getUniqueBrandsByEmail,
  productTypeFilter,
};
