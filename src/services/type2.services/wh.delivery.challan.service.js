const httpStatus = require('http-status');
const { WhDeliveryChallan, PurchaseOrderType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createWhDeliveryChallan = async (reqBody) => {
  // const { email, poNumber } = reqBody;
  // await PurchaseOrderType2.findOneAndUpdate(
  //     { email: email, poNumber: poNumber },
  //     { $set: { status: 'shipped' } },
  //     { new: true })

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

// const getDeliveryChallanByManufactureEmail = async (manufacturerEmail, filter, options) => {
//     // Apply additional filters
//     if (filter) {
//         const parsedFilter = JSON.parse(filter);
//         Object.assign(query, parsedFilter);
//     }

//     // Use Mongoose paginate plugin
//     const result = await WhDeliveryChallan.paginate(query, {
//         ...options,
//         customLabels: { docs: 'mnfdeliverychallans' },
//     });

//     return result;
// };
// Create combined PO for wholesaler
module.exports = {
  createWhDeliveryChallan,
  queryWhDeliveryChallan,
  getWhDeliveryChallanById,
  genratedeChallNO,
  updateWhDeliveryChallanById,
  deleteWhDeliveryChallanById,
  // getDeliveryChallanByManufactureEmail,
};
