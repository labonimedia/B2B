const httpStatus = require('http-status');
const { PORetailerToWholesaler, RetailerCartType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Get PORetailerToWholesaler by id
 * @param {ObjectId} id
 * @returns {Promise<PORetailerToWholesaler>}
 */
const getSinglePoRetailerToWholesaler = async (id) => {
    return PORetailerToWholesaler.findById(id);
  };

/**
 * Create Retailer PO and remove matching cart entry
 */
const createPurchaseOrderRetailerType2 = async (reqBody) => {
    const { cartId } = reqBody;

    if (!cartId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "'cartId' is required.");
    }
    
    await RetailerCartType2.findByIdAndDelete({_id:cartId});

  const purchaseOrder = await PORetailerToWholesaler.create(reqBody);
  return purchaseOrder;
};



/**
 * Query for PurchaseOrderRetailerType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllPoRetailerToWholesaler = async (filter, options) => {
  const poRetailerToWholesaler = await PORetailerToWholesaler.paginate(filter, options);
  return poRetailerToWholesaler;
};

/**
 * Wholesaler views retailer POs
 */
const getRetailerPOByWholesaler = async (wholesalerEmail) => {
  return PORetailerToWholesaler.find({ wholesalerEmail }).sort({ createdAt: -1 });
};

/**
 * Wholesaler updates a specific set item in the PO
 */
const updateRetailerPOSetItem = async (poId, updateBody) => {
  const { designNumber, colour, size, updatedFields } = updateBody;

  const po = await PORetailerToWholesaler.findById(poId);
  if (!po) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');

  const item = po.set.find(
    (item) =>
      item.designNumber === designNumber &&
      item.colour === colour &&
      item.size === size
  );

  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found in PO');

  Object.keys(updatedFields).forEach((key) => {
    item[key] = updatedFields[key];
  });

  await po.save();
  return po;
};



/**
 * Update PORetailerToWholesaler by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PORetailerToWholesaler>}
 */
const updateSinglePoRetailerToWholesaler = async (id, updateBody) => {
    const cart = await getSinglePoRetailerToWholesaler(id);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    Object.assign(cart, updateBody);
    await cart.save();
    return cart;
  };
  
  /**
   * Delete PORetailerToWholesaler by id
   * @param {ObjectId} id
   * @returns {Promise<PORetailerToWholesaler>}
   */
  const deleteSinglePoRetailerToWholesaler = async (id) => {
    const cart = await getSinglePoRetailerToWholesaler(id);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    await cart.remove();
    return cart;
  };

module.exports = {
  createPurchaseOrderRetailerType2,
  getRetailerPOByWholesaler,
  updateRetailerPOSetItem,
  getAllPoRetailerToWholesaler,
  updateSinglePoRetailerToWholesaler,
  deleteSinglePoRetailerToWholesaler,
  getSinglePoRetailerToWholesaler,
};
