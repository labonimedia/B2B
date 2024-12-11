const httpStatus = require('http-status');
const { MnfDeliveryChallan } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
const createMnfDeliveryChallan = async (reqBody) => {
    return await MnfDeliveryChallan.create(reqBody);
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

const getProductOrderBySupplyer = async (supplierEmail) => {
    const productOrders = await MnfDeliveryChallan.find({ productBy: supplierEmail });

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

const getPurchaseOrdersByManufactureEmail = async (manufacturerEmail, filter, options) => {
    const query = { 'manufacturer.email': manufacturerEmail };

    // Apply additional filters
    if (filter) {
        const parsedFilter = JSON.parse(filter);
        Object.assign(query, parsedFilter);
    }

    // Use Mongoose paginate plugin
    const result = await MnfDeliveryChallan.paginate(query, {
        ...options,
        customLabels: { docs: 'purchaseOrders' },
    });

    return result;
};
// Create combined PO for wholesaler
module.exports = {
    createMnfDeliveryChallan,
    queryMnfDeliveryChallan,
    getProductOrderBySupplyer,
    getMnfDeliveryChallanById,
    updateMnfDeliveryChallanById,
    deleteMnfDeliveryChallanById,
    getPurchaseOrdersByManufactureEmail,
};
