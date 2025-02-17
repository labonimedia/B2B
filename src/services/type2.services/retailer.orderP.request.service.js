const httpStatus = require('http-status');
const { RetailerPartialReq } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a RetailerPartialReq
 * @param {Object} reqBody
 * @returns {Promise<RetailerPartialReq>}
 */
const createRetailerPartialReq = async (reqBody) => {
    if (!reqBody) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `body is empty`);
    }
    return RetailerPartialReq.create(reqBody);
};

/**
 * Query for RetailerPartialReq
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRetailerPartialReq = async (filter, options) => {
    const citys = await RetailerPartialReq.paginate(filter, options);
    return citys;
};

/**
 * Get RetailerPartialReq by id
 * @param {ObjectId} id
 * @returns {Promise<RetailerPartialReq>}
 */
const getRetailerPartialReqById = async (id) => {
    return RetailerPartialReq.findById(id);
};

/**
 * Update RetailerPartialReq by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<RetailerPartialReq>}
 */
const updateRetailerPartialReqById = async (id, updateBody) => {
    const user = await getRetailerPartialReqById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'request not found');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<RetailerPartialReq>}
 */
const deleteRetailerPartialReqById = async (id) => {
    const user = await getRetailerPartialReqById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'reuest not found');
    }
    await user.remove();
    return user;
};

module.exports = {
    createRetailerPartialReq,
    queryRetailerPartialReq,
    getRetailerPartialReqById,
    updateRetailerPartialReqById,
    deleteRetailerPartialReqById,
};
