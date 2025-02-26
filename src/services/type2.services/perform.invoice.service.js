const httpStatus = require('http-status');
const { PerformInvoice, PurchaseOrderType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createPerformInvoice = async (reqBody) => {
  const { email, poNumber } = reqBody;

  await PurchaseOrderType2.findOneAndUpdate({ email, poNumber }, { $set: { status: 'shipped' } }, { new: true });
  return await PerformInvoice.create(reqBody);
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
const queryPerformInvoice = async (filter, options) => {
  const mnfDeliveryChallans = await PerformInvoice.paginate(filter, options);
  return mnfDeliveryChallans;
};

/**
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getPerformInvoiceById = async (id) => {
  return PerformInvoice.findById(id);
};

/**
 * genrate delivery challan number
 * @param {params} manufacturerEmail
 * @returns {Promise<PerformInvoice>}
 */
const genratedeChallNO = async (manufacturerEmail) => {
  const lastPO = await PerformInvoice.findOne({ productBy: manufacturerEmail }).sort({ deliveryChallanNumber: -1 }).lean();
  const nextdeliveryChallanNumber = lastPO ? lastPO.deliveryChallanNumber + 1 : 1;
  return {
    deliveryChallanNumber: nextdeliveryChallanNumber,
  };
};

/**
 * Update PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderType2>}
 */
const updatePerformInvoiceById = async (id, updateBody) => {
  const cart = await getMnfDeliveryChallanById(id);
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
const deletePerformInvoiceById = async (id) => {
  const cart = await getPerformInvoiceById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  await cart.remove();
  return cart;
};

const getPerformInvoiceByManufactureEmail = async (manufacturerEmail, filter, options) => {
  // Apply additional filters
  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.assign(query, parsedFilter);
  }
  // Use Mongoose paginate plugin
  const result = await PerformInvoice.paginate(query, {
    ...options,
    customLabels: { docs: 'mnfdeliverychallans' },
  });

  return result;
};

// Create combined PO for wholesaler
module.exports = {
  createPerformInvoice,
  queryPerformInvoice,
  getPerformInvoiceById,
  genratedeChallNO,
  updatePerformInvoiceById,
  deletePerformInvoiceById,
  getPerformInvoiceByManufactureEmail,
};
