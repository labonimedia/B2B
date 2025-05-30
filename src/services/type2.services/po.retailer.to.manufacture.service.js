const httpStatus = require('http-status');
const { PORetailerToManufacturer, RtlToMnfCart } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Get PORetailerToManufacture by id
 * @param {ObjectId} id
 * @returns {Promise<PORetailerToManufacturer>}
 */
const getSinglePoRetailerToManufacture = async (id) => {
    return PORetailerToManufacturer.findById(id);
  };

/**
 * Create Retailer PO and remove matching cart entry
 */
const createPurchaseOrderRetailerType2 = async (reqBody) => {
    const { cartId } = reqBody;

    if (!cartId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "'cartId' is required.");
    }
    
    await RtlToMnfCart.findByIdAndDelete({_id:cartId});

  const purchaseOrder = await PORetailerToManufacturer.create(reqBody);
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
const getAllPoRetailerToManufacture = async (filter, options) => {
  const PORetailerToManufacture = await PORetailerToManufacturer.paginate(filter, options);
  return PORetailerToManufacture;
};

/**
 * Manufacture views retailer POs
 */
const getRetailerPOByManufacture = async (manufacturerEmail) => {
  return PORetailerToManufacturer.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

/**
 * Manufacture updates a specific set item in the PO
 */
const updateRetailerPOSetItem = async (poId, updateBody) => {
  const { designNumber, colour, size, updatedFields } = updateBody;

  const po = await PORetailerToManufacturer.findById(poId);
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
 * Update PORetailerToManufacturer by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PORetailerToManufacturer>}
 */
const updateSinglePoRetailerToManufacture = async (id, updateBody) => {
    const cart = await getSinglePoRetailerToManufacture(id);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    Object.assign(cart, updateBody);
    await cart.save();
    return cart;
  };
  
  /**
   * Delete PORetailerToManufacture by id
   * @param {ObjectId} id
   * @returns {Promise<PORetailerToManufacturer>}
   */
  const deleteSinglePoRetailerToManufacture = async (id) => {
    const cart = await getSinglePoRetailerToManufacture(id);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    await cart.remove();
    return cart;
  };

module.exports = {
  createPurchaseOrderRetailerType2,
  getRetailerPOByManufacture,
  updateRetailerPOSetItem,
  getAllPoRetailerToManufacture,
  updateSinglePoRetailerToManufacture,
  deleteSinglePoRetailerToManufacture,
  getSinglePoRetailerToManufacture,
};
