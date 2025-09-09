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
const genratedeChallNO = async (email) => {
  const lastPO = await PORetailerToManufacturer.findOne({ email }).sort({ poNumber: -1 }).lean();
  return (nextdeliveryChallanNumber = lastPO ? lastPO.poNumber + 1 : 1);
};

/**
 * Create Retailer PO and remove matching cart entry
 */
const makeToOrderPO = async (reqBody) => {
  if (!reqBody.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Retailer email is required to generate PO Number');
  }

  // Generate new PO number for this retailer
  const nextPoNumber = await genratedeChallNO(reqBody.email);

  // Attach generated PO number to the new PO
  reqBody.poNumber = nextPoNumber;

  // Create new PO
  const purchaseOrder = await PORetailerToManufacturer.create(reqBody);

  // OPTIONAL: remove related cart entries if cartId exists
  if (reqBody.cartId) {
    await RtlToMnfCart.findByIdAndDelete(reqBody.cartId);
  }

  return purchaseOrder;
};
/**
 * Create Retailer PO and remove matching cart entry
 */
const createPurchaseOrderRetailerType2 = async (reqBody) => {
  const { cartId } = reqBody;

  if (!cartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'cartId' is required.");
  }

  await RtlToMnfCart.findByIdAndDelete({ _id: cartId });

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
  const poRetailerToManufacture = await PORetailerToManufacturer.paginate(filter, options);
  return poRetailerToManufacture;
};

/**
 * Manufacture views retailer POs
 */
const getRetailerPOByManufacture = async (manufacturerEmail) => {
  return PORetailerToManufacturer.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

const updateRetailerPOSetItem = async (poId, updateBody) => {
  const po = await PORetailerToManufacturer.findById(poId);
  if (!po) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');

  // Update top-level fields (except _id and set)
  Object.keys(updateBody).forEach((key) => {
    if (key !== 'set' && key !== '_id') {
      po[key] = updateBody[key];
    }
  });

  // Update set items if present
  if (Array.isArray(updateBody.set)) {
    updateBody.set.forEach((incomingSetItem) => {
      if (!incomingSetItem._id) return; // skip if no _id

      const existingSetItem = po.set.id(incomingSetItem._id);
      if (existingSetItem) {
        Object.keys(incomingSetItem).forEach((field) => {
          if (field !== '_id') {
            existingSetItem[field] = incomingSetItem[field];
          }
        });
      }
    });
  }

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
  makeToOrderPO,
};
