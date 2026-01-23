const httpStatus = require('http-status');
const { WhDeliveryChallan, PurchaseOrderType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createWhDeliveryChallan = async (reqBody) => {
  return await WhDeliveryChallan.create(reqBody);
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
const queryWhDeliveryChallan = async (filter, options) => {
  const mnfDeliveryChallans = await WhDeliveryChallan.paginate(filter, options);
  return mnfDeliveryChallans;
};

/**
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getWhDeliveryChallanById = async (id) => {
  return WhDeliveryChallan.findById(id);
};

/**
 * genrate delivery challan number
 * @param {params} manufacturerEmail
 * @returns {Promise<WhDeliveryChallan>}
 */
const genratedeChallNO = async (wholesalerEmail) => {
  const lastPO = await WhDeliveryChallan.findOne({ wholesalerEmail }).sort({ deliveryChallanNumber: -1 }).lean();
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
const updateWhDeliveryChallanById = async (id, updateBody) => {
  const cart = await getWhDeliveryChallanById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wholesaler challan not found');
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
const deleteWhDeliveryChallanById = async (id) => {
  const cart = await getWhDeliveryChallanById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wholesaler challan not found');
  }
  await cart.remove();
  return cart;
};

module.exports = {
  createWhDeliveryChallan,
  queryWhDeliveryChallan,
  getWhDeliveryChallanById,
  genratedeChallNO,
  updateWhDeliveryChallanById,
  deleteWhDeliveryChallanById,
};
