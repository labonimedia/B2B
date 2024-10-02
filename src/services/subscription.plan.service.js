const httpStatus = require('http-status');
const { SubscriptionPlan } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a SubscriptionPlan
 * @param {Object} reqBody
 * @returns {Promise<SubscriptionPlan>}
 */
const createSubscriptionPlan = async (reqBody) => {
    return SubscriptionPlan.create(reqBody);
};

/**
 * Query for SubscriptionPlan
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubscriptionPlan = async (filter, options) => {
    const topType = await SubscriptionPlan.paginate(filter, options);
    return topType;
};

/**
 * Get SubscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getSubscriptionPlanById = async (id) => {
    return SubscriptionPlan.findById(id);
};

/**
 * Update SubscriptionPlan by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateSubscriptionPlanById = async (id, updateBody) => {
    const user = await getSubscriptionPlanById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<SubscriptionPlan>}
 */
const deleteSubscriptionPlanById = async (id) => {
    const user = await getSubscriptionPlanById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
    }
    await user.remove();
    return user;
};

module.exports = {
    createSubscriptionPlan,
    querySubscriptionPlan,
    getSubscriptionPlanById,
    updateSubscriptionPlanById,
    deleteSubscriptionPlanById,
};
