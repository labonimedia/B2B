const httpStatus = require('http-status');
const { PurchaseOrderType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createPurchaseOrderType2 = async (reqBody) => {
  return PurchaseOrderType2.create(reqBody);
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

module.exports = {
  createPurchaseOrderType2,
  queryPurchaseOrderType2,
  getPurchaseOrderType2ById,
  updatePurchaseOrderType2ById,
  deletePurchaseOrderType2ById,
};


