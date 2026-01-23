const httpStatus = require('http-status');
const {
  PurchaseOrderType2,
  CartType2,
  PurchaseOrderRetailerType2,
  MnfDeliveryChallan,
  RetailerPartialReq,
} = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */

const getSinglePurchaseOrderDataByWholesalerEmail = async (body) => {
  const { email, productBy, poNumber } = body;

  if (!email || !productBy || !poNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email, productBy, and poNumber are required.');
  }

  const purchaseOrder = await PurchaseOrderType2.findOne({
    email,
    productBy,
    poNumber,
  });

  if (!purchaseOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase order not found.');
  }

  return purchaseOrder;
};
const createPurchaseOrderType2 = async (reqBody) => {
  const { email, productBy, retailerPOs } = reqBody;
  // Validate that required fields are provided
  if (!email || !productBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Both 'email' and 'productBy' are required.");
  }

  let createdPurchaseOrder;

  if (!Array.isArray(retailerPOs) || retailerPOs.length === 0) {
    // Handle case where `retailerPOs` is not provided
    console.warn("'retailerPOs' not provided. Creating purchase order without retailer-specific processing.");
    await CartType2.findOneAndDelete({ email, productBy });
    // Create a purchase order without processing `retailerPOs`
    createdPurchaseOrder = await PurchaseOrderType2.create(reqBody);
  } else {
    createdPurchaseOrder = await PurchaseOrderType2.create(reqBody);
    if (!createdPurchaseOrder) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create the purchase order.');
    }
    for (const retailerPO of retailerPOs) {
      const retailerOrder = await PurchaseOrderRetailerType2.findOne({
        email: retailerPO.email,
        poNumber: retailerPO.poNumber,
      });

      if (!retailerOrder) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Retailer purchase order not found.');
      }

      // Update the status in the `set` array where `designNumber` matches
      retailerOrder.set.forEach((item) => {
        if (reqBody.set.some((reqItem) => reqItem.designNumber === item.designNumber)) {
          item.status = 'processing';
        }
      });

      retailerOrder.statusAll = 'processing';

      // Save the updated retailer order
      await retailerOrder.save();
    }
  }

  return createdPurchaseOrder;
};

const deleteCartType2ById = async (email, productBy) => {
  const purchaseOrderType2 = await CartType2.findOneAndDelete({ email, productBy });
  if (!purchaseOrderType2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found');
  }
  return purchaseOrderType2;
};

/**
 * Query for PurchaseOrderType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPurchaseOrderType2 = async (filter, options) => {
  const purchaseOrderType2Items = await PurchaseOrderType2.paginate(filter, options);
  return purchaseOrderType2Items;
};

/**
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getPurchaseOrderType2ById = async (id) => {
  return PurchaseOrderType2.findById(id);
};

const getPurchanseOrderByEmail = async (email, page, limit) => {
  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { createdAt: -1 }, // Sort by newest first
  };

  const query = {
    email,
    'retailerPOs.0': { $exists: false }, // Empty retailerPOs
  };

  const result = await PurchaseOrderType2.paginate(query, options);
  return result;
};
const getProductOrderBySupplyer = async (supplierEmail) => {
  const productOrders = await PurchaseOrderType2.find({ productBy: supplierEmail });

  if (productOrders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Product Orders found for this supplier');
  }

  return productOrders;
};

/**
 * Update PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderType2>}
 */
const updatePurchaseOrderType2ById = async (id, updateBody) => {
  const cart = await getPurchaseOrderType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const deletePurchaseOrderType2ById = async (id) => {
  const cart = await getPurchaseOrderType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  await cart.remove();
  return cart;
};

const getPurchaseOrdersByManufactureEmail = async (manufacturerEmail, filter, options) => {
  const query = { 'manufacturer.email': manufacturerEmail };

  // Apply additional filters
  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.assign(query, parsedFilter);
  }

  // Use Mongoose paginate plugin
  const result = await PurchaseOrderType2.paginate(query, {
    ...options,
    customLabels: { docs: 'purchaseOrders' }, // Rename `docs` to `purchaseOrders` in response
  });

  return result;
};

const updatePurchaseOrderQuantities = async (purchaseOrderId) => {
  try {
    const mnfChallan = await MnfDeliveryChallan.findOne({ _id: purchaseOrderId }).lean();
    if (!mnfChallan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'MnfDeliveryChallan not found');
    }

    const purchaseOrder = await PurchaseOrderType2.findOne({
      email: mnfChallan.email,
      productBy: mnfChallan.productBy,
      poNumber: mnfChallan.poNumber,
    });
    if (!purchaseOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }

    const retailerPOs = purchaseOrder.retailerPOs || [];
    const retailerPOFilters = retailerPOs.map((po) => ({
      retailerEmail: po.email,
      poNumber: po.poNumber,
    }));

    if (!retailerPOFilters.length) {
      console.log('No retailer POs found.');
      return;
    }

    const retailerRequests = await RetailerPartialReq.find({
      $or: retailerPOFilters,
    });

    if (!retailerRequests.length) {
      console.log('No rejected retailer requests found.');
      return;
    }

    const rejectedItemsMap = new Map();
    retailerRequests.forEach((req) => {
      req.requestedItems.forEach((item) => {
        if (item.statusSingle === 'rejected') {
          const key = `${item.designNumber}-${item.colour}-${item.size}`;
          rejectedItemsMap.set(key, (rejectedItemsMap.get(key) || 0) + item.orderedQuantity);
        }
      });
    });

    if (!rejectedItemsMap.size) {
      return { result: 'No rejected items to update.' };
    }

    purchaseOrder.set = purchaseOrder.set
      .map((item) => {
        const key = `${item.designNumber}-${item.colour}-${item.size}`;
        const newQuantity = rejectedItemsMap.has(key)
          ? Math.max(0, item.quantity - rejectedItemsMap.get(key))
          : item.quantity;

        return newQuantity > 0 ? { ...item.toObject(), quantity: newQuantity } : null;
      })
      .filter((item) => item !== null);

    purchaseOrder.status = 'updated';
    await purchaseOrder.save();
    return purchaseOrder;
  } catch (error) {
    console.log(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating purchase order quantities');
  }
};

module.exports = {
  createPurchaseOrderType2,
  queryPurchaseOrderType2,
  getProductOrderBySupplyer,
  getPurchanseOrderByEmail,
  getPurchaseOrderType2ById,
  updatePurchaseOrderType2ById,
  deletePurchaseOrderType2ById,
  deleteCartType2ById,
  getPurchaseOrdersByManufactureEmail,
  updatePurchaseOrderQuantities,
  getSinglePurchaseOrderDataByWholesalerEmail,
};
