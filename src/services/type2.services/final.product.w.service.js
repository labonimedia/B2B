const httpStatus = require('http-status');
const { FinalProductW } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple WholesalerReturn items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<FinalProductW>}
 */
const createFinalProductW = async (reqBody) => {
    return await FinalProductW.create(reqBody);
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
const queryFinalProductW = async (filter, options) => {
    const finalProductWs = await FinalProductW.paginate(filter, options);
    return finalProductWs;
};

/**
 * Get WholesalerReturn by id
 * @param {ObjectId} id
 * @returns {Promise<WholesalerReturn>}
 */
const getFinalProductWById = async (id) => {
    return FinalProductW.findById(id);
};

module.exports = {
    createFinalProductW,
    queryFinalProductW,
    getFinalProductWById,
};
