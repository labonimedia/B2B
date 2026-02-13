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

const createPurchaseOrderRetailerType2 = async (reqBody) => {
  const { cartId } = reqBody;

  if (!cartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'cartId' is required.");
  }

  await RetailerCartType2.findByIdAndDelete({ _id: cartId });

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

const getRetailerPOByWholesaler = async (wholesalerEmail) => {
  return PORetailerToWholesaler.find({ wholesalerEmail }).sort({ createdAt: -1 });
};

const updateRetailerPOSetItem = async (poId, updateBody) => {
  const { designNumber, colour, size, updatedFields } = updateBody;

  const po = await PORetailerToWholesaler.findById(poId);
  if (!po) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');

  const item = po.set.find((item) => item.designNumber === designNumber && item.colour === colour && item.size === size);

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

const getPOsByIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'IDs array is required');
  }

  const pos = await PORetailerToWholesaler.find({
    _id: { $in: ids },
  });

  return pos;
};
const updatePoData = async (poId, updateBody) => {
  const po = await PORetailerToWholesaler.findById(poId);
  if (!po) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PO not found');
  }

  /* -------------------------
     UPDATE TOP LEVEL FIELDS
  --------------------------*/
  Object.keys(updateBody).forEach((key) => {
    if (key !== 'set' && key !== '_id') {
      po[key] = updateBody[key];
    }
  });

  /* -------------------------
     UPDATE SET ARRAY ITEMS
  --------------------------*/
  if (Array.isArray(updateBody.set)) {
    updateBody.set.forEach((updatedSetItem) => {
      if (!updatedSetItem._id) return;

      const existingItem = po.set.id(updatedSetItem._id);

      if (existingItem) {
        Object.keys(updatedSetItem).forEach((field) => {
          if (field !== '_id') {
            existingItem[field] = updatedSetItem[field];
          }
        });
      }
    });
  }

  await po.save();
  return po;
};

const generatePoNumber = async (email) => {
  const lastPO = await PORetailerToWholesaler.findOne({ retailerEmail: email }).sort({ createdAt: -1 }).lean();

  return lastPO ? lastPO.poNumber + 1 : 1001;
};

/* ---------- Make To Order PO ---------- */
const makeToOrderPO = async (reqBody) => {
  if (!reqBody.retailerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Retailer email is required to generate PO Number');
  }

  const nextPoNumber = await generatePoNumber(reqBody.retailerEmail);

  reqBody.poNumber = nextPoNumber;
  reqBody.statusAll = 'w_make_to_order';

  const purchaseOrder = await PORetailerToWholesaler.create(reqBody);

  if (reqBody.cartId) {
    await RetailerCartType2.findByIdAndDelete(reqBody.cartId);
  }

  return purchaseOrder;
};

module.exports = {
  createPurchaseOrderRetailerType2,
  getRetailerPOByWholesaler,
  updateRetailerPOSetItem,
  getAllPoRetailerToWholesaler,
  updateSinglePoRetailerToWholesaler,
  deleteSinglePoRetailerToWholesaler,
  getSinglePoRetailerToWholesaler,
  getPOsByIds,
  updatePoData,
  makeToOrderPO,
};
