const httpStatus = require('http-status');
const { WholesalerReturn } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple WholesalerReturn items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<WholesalerReturn>}
 */
const createWholesalerReturn = async (reqBody) => {
    return await WholesalerReturn.create(reqBody);
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
const queryWholesalerReturn = async (filter, options) => {
    const WholesalerReturns = await WholesalerReturn.paginate(filter, options);
    return WholesalerReturns;
};

/**
 * Get WholesalerReturn by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerReturn>}
 */
const getWholesalerReturnById = async (id) => {
    return WholesalerReturn.findById(id);
};

module.exports = {
    createWholesalerReturn,
    queryWholesalerReturn,
    getWholesalerReturnById,
};
