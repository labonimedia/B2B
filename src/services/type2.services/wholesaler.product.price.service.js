const httpStatus = require('http-status');
const { WholesalerPriceType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a WholesalerPriceType2Type2
 * @param {Object} reqBody
 * @returns {Promise<WholesalerPriceType2>}
 */
const createWholesalerPriceType2 = async (reqBody) => {
  return WholesalerPriceType2.create(reqBody);
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
  

/**
 * Get WholesalerPriceType2 by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerPriceType2>}
 */
const getWholesalerPriceType2ById = async (id) => {
  return WholesalerPriceType2.findById(id);
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
  createWholesalerPriceType2,
  queryWholesalerPriceType2,
  getWholesalerPriceType2ById,
  updateWholesalerPriceType2ById,
  deleteWholesalerPriceType2ById,
};
