const httpStatus = require('http-status');
const { MnfDeliveryChallan, PurchaseOrderType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');
// const { autoForwardQueue, autoCancelQueue } = require("../../utils/queue");

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createMnfDeliveryChallan = async (reqBody) => {
    const { email, poNumber } = reqBody;
    await PurchaseOrderType2.findOneAndUpdate(
        { email: email, poNumber: poNumber },
        { $set: { status: 'shipped' } },
        { new: true })

    const result = await MnfDeliveryChallan.create(reqBody)
    // await autoForwardQueue.add(
    //     { orderId: result._id },
    //     { delay: 4 * 60 * 60 * 1000 }
    // );
    return result
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
const queryMnfDeliveryChallan = async (filter, options) => {
    const mnfDeliveryChallans = await MnfDeliveryChallan.paginate(filter, options);
    return mnfDeliveryChallans;
};

/**
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getMnfDeliveryChallanById = async (id) => {
    return MnfDeliveryChallan.findById(id);
};

/**
 * genrate delivery challan number 
 * @param {params} manufacturerEmail 
 * @returns {Promise<MnfDeliveryChallan>}
 */
const genratedeChallNO = async (manufacturerEmail) => {
    const lastPO = await MnfDeliveryChallan.findOne({ productBy: manufacturerEmail })
        .sort({ deliveryChallanNumber: -1 })
        .lean();
    let nextdeliveryChallanNumber = lastPO ? lastPO.deliveryChallanNumber + 1 : 1;
    return {
        deliveryChallanNumber: nextdeliveryChallanNumber,
    }
};

/**
 * Update PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderType2>}
 */
const updateMnfDeliveryChallanById = async (id, updateBody) => {
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
const deleteMnfDeliveryChallanById = async (id) => {
    const cart = await getMnfDeliveryChallanById(id);
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    await cart.remove();
    return cart;
};

const getDeliveryChallanByManufactureEmail = async (manufacturerEmail, filter, options) => {
    // Apply additional filters
    if (filter) {
        const parsedFilter = JSON.parse(filter);
        Object.assign(query, parsedFilter);
    }

    // Use Mongoose paginate plugin
    const result = await MnfDeliveryChallan.paginate(query, {
        ...options,
        customLabels: { docs: 'mnfdeliverychallans' },
    });

    return result;
};
// Create combined PO for wholesaler
module.exports = {
    createMnfDeliveryChallan,
    queryMnfDeliveryChallan,
    getMnfDeliveryChallanById,
    genratedeChallNO,
    updateMnfDeliveryChallanById,
    deleteMnfDeliveryChallanById,
    getDeliveryChallanByManufactureEmail,
};
