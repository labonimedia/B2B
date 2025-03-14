const httpStatus = require('http-status');
const { RtlToMnfPo, RtlToMnfCart } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderRetailerType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<RtlToMnfPo>>}
 */
const createPurchaseOrderRetailerType2 = async (reqBody) => {
  const { email, productBy } = reqBody;

  // Validate that `email` and `productBy` are provided
  if (!email || !productBy) {
    throw new ApiError(httpStatus.NOT_FOUND, "Both 'email' and 'productBy' are required.");
  }

  // Find and delete the cart item(s) matching the given `email` and `productBy`
  await RtlToMnfCart.findOneAndDelete({ email, productBy });
  // Create a new purchase order using the provided request body
  const purchaseOrder = await RtlToMnfPo.create(reqBody);

  // Return the newly created purchase order
  return purchaseOrder;
};

const deleteCartType2ById = async (email, productBy) => {
  const PurchaseOrderRetailerType2 = await RtlToMnfCart.findOneAndDelete({ email, productBy });
  if (!PurchaseOrderRetailerType2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found');
  }
  return PurchaseOrderRetailerType2;
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
const queryPurchaseOrderRetailerType2 = async (filter, options) => {
  const PurchaseOrderRetailerType2Items = await RtlToMnfPo.paginate(filter, options);
  return PurchaseOrderRetailerType2Items;
};

/**
 * Get PurchaseOrderRetailerType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderRetailerType2>}
 */
const getPurchaseOrderRetailerType2ById = async (id) => {
  return RtlToMnfPo.findById(id);
};

const getProductOrderBySupplyer = async (productBy) => {
  const productOrders = await RtlToMnfPo.find({ productBy });

  if (productOrders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Product Orders found for this supplier');
  }
  return productOrders;
};

/**
 * Update PurchaseOrderRetailerType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderRetailerType2>}
 */
const updatePurchaseOrderRetailerType2ById = async (id, updateBody) => {
  const cart = await getPurchaseOrderRetailerType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete PurchaseOrderRetailerType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderRetailerType2>}
 */
const deletePurchaseOrderRetailerType2ById = async (id) => {
  const cart = await getPurchaseOrderRetailerType2ById(id);
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
  const result = await RtlToMnfPo.paginate(query, {
    ...options,
    customLabels: { docs: 'purchaseOrders' }, // Rename `docs` to `purchaseOrders` in response
  });

  return result;
};

module.exports = {
  createPurchaseOrderRetailerType2,
  queryPurchaseOrderRetailerType2,
  getProductOrderBySupplyer,
  getPurchaseOrderRetailerType2ById,
  updatePurchaseOrderRetailerType2ById,
  deletePurchaseOrderRetailerType2ById,
  deleteCartType2ById,
  getPurchaseOrdersByManufactureEmail,
};
