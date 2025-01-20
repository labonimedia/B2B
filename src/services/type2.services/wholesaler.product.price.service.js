const httpStatus = require('http-status');
const { WholesalerPriceType2, ProductType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a WholesalerPriceType2Type2
 * @param {Object} reqBody
 * @returns {Promise<WholesalerPriceType2>}
 */
const createOrUpdateWholesalerPriceType2 = async (reqBody) => {
  const { productId, WholesalerEmail } = reqBody; // Extract productId and other fields from request body

  // Find existing record by productId
  const existingRecord = await WholesalerPriceType2.findOne({ productId, WholesalerEmail });

  if (existingRecord) {
    // If record exists, update it
    Object.assign(existingRecord, reqBody); // Merge the update data into the existing record
    return existingRecord.save(); // Save the updated record
  } else {
    // If no record exists, create a new one
    return WholesalerPriceType2.create(reqBody);
  }
};


/**
 * Query for WholesalerPriceType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWholesalerPriceType2 = async (wholesalerEmail, options) => {
  // Add filter by WholesalerEmail
  const filter = { WholesalerEmail: wholesalerEmail };
  // Ensure 'populate' includes 'productId'
  if (!options.populate) {
    options.populate = 'productId';
  } else if (!options.populate.split(',').includes('productId')) {
    options.populate += ',productId';
  }
  const wholesalerPrice = await WholesalerPriceType2.paginate(filter, options);
  return wholesalerPrice;
};

const getFilteredProducts = async (body) => {
  try {
    const { wholesalerEmail, limit = 10, page = 1, ...productFilters } = body;

    // Calculate pagination parameters
    const parsedLimit = parseInt(limit, 10) || 10; // Default limit to 10 if not provided
    const parsedPage = parseInt(page, 10) || 1; // Default page to 1 if not provided
    const skip = (parsedPage - 1) * parsedLimit;

    // Step 1: Fetch productIds from WholesalerPriceType2 using wholesalerEmail
    const wholesalerPrices = await WholesalerPriceType2.find(
      { WholesalerEmail: wholesalerEmail },
      { productId: 1 } // Only select productId
    );

    // If no matching productIds found, return an empty result with pagination metadata
    if (!wholesalerPrices.length) {
      return {
        products: [],
        total: 0,
        page: parsedPage,
        totalPages: 0,
      };
    }

    // Extract productIds from the wholesalerPrices
    const productIds = wholesalerPrices.map((price) => price.productId);

    // Step 2: Fetch ProductType2 data using the productIds and additional filters
    const [products, total] = await Promise.all([
      ProductType2.find({
        _id: { $in: productIds },
        ...productFilters, // Apply additional filters (e.g., brand, productType, etc.)
      })
        .skip(skip)
        .limit(parsedLimit),
      ProductType2.countDocuments({
        _id: { $in: productIds },
        ...productFilters,
      }),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / parsedLimit);

    // Return paginated results with metadata
    return {
      products,
      total,
      page: parsedPage,
      totalPages,
    };
  } catch (error) {
    throw new Error('Failed to retrieve products');
  }
};



/**
 * Get WholesalerPriceType2 by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerPriceType2>}
 */
const getWholesalerPriceType2ById = async (productId) => {
  return WholesalerPriceType2.findOne({ productId });
};


const getWholesalerPriceType2ByIdWholesaler = async (productId, WholesalerEmail) => {
  return WholesalerPriceType2.findOne({ productId, WholesalerEmail });
};


/**
 * Get WholesalerPriceType2 by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerPriceType2>}
 */
const getRetailerPriceById = async (productId, WholesalerEmail) => {
  // Find the retailer price by productId  
  const objectId = mongoose.Types.ObjectId(productId);
  const retailerPrice = await WholesalerPriceType2.findOne({ productId: objectId, WholesalerEmail }).lean();
  // If no retailer price is found, handle it gracefully
  if (!retailerPrice) {
    return { message: "Retailer price not found for the given product ID." };
  }

  // Find the associated product details
  const product = await ProductType2.findById(objectId).lean();
  // If no product is found, handle it gracefully
  if (!product) {
    return { message: "Product not found for the given product ID." };
  }
  // Return combined data
  return {
    retailerPrice,
    product,
  };
};


/**
 * Update WholesalerPriceType2 by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<WholesalerPriceType2>}
 */
const updateWholesalerPriceType2ById = async (id, updateBody) => {
  const wholesalerPrice = await getWholesalerPriceType2ById(id);
  if (!wholesalerPrice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler Price not found');
  }
  Object.assign(wholesalerPrice, updateBody);
  await wholesalerPrice.save();
  return wholesalerPrice;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<WholesalerPriceType2>}
 */
const deleteWholesalerPriceType2ById = async (id) => {
  const wholesalerPrice = await getWholesalerPriceType2ById(id);
  if (!wholesalerPrice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler Price not found');
  }
  await wholesalerPrice.remove();
  return wholesalerPrice;
};

module.exports = {
  createOrUpdateWholesalerPriceType2,
  queryWholesalerPriceType2,
  getFilteredProducts,
  getWholesalerPriceType2ById,
  getWholesalerPriceType2ByIdWholesaler,
  getRetailerPriceById,
  updateWholesalerPriceType2ById,
  deleteWholesalerPriceType2ById,
};
