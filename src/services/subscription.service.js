const httpStatus = require('http-status');
const { Subscription, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Subscription
 * @param {Object} reqBody
 * @returns {Promise<Subscription>}
 */
const createSubscription = async (reqBody) => {
    const { userId, planId } = reqBody;
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    // Find the subscription plan
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
    }

    // Calculate subscription end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    // Create new subscription details for the user
    const newSubscription = new SubscriptionDetails({
        userId: user._id,
        subscriptionPlan: plan._id,
        startDate: new Date(),
        endDate,
        status: 'active',
    });

    // Save subscription details
    await newSubscription.save();

    // Save the subscription reference in the user's document
    user.subscriptionId = newSubscription._id;
    await user.save();


    return newSubscription;
};
// const createSubscription = async (reqBody) => {
//   return Subscription.create(reqBody);
// };

/**
 * Query for Subscription
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubscription = async (filter, options) => {
    const topType = await Subscription.paginate(filter, options);
    return topType;
};

// Get user's subscription details
const getSubscriptionDetail =  async (req, res) => {
    const { userId } = req.params;

    // Find the user by ID and populate subscription details with the plan
    const user = await User.findById(userId).populate({
      path: 'subscriptionId',
      populate: {
        path: 'subscriptionPlan',
        model: 'SubscriptionPlan', // Populate subscription plan details
      },
    });

    if (!user || !user.subscriptionId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No subscription found for this user');
    }

   return user.subscriptionId;
};


/**
 * Get Subscription by id
 * @param {ObjectId} id
 * @returns {Promise<Subscription>}
 */
const getSubscriptionById = async (id) => {
    return Subscription.findById(id);
};

/**
 * Update Subscription by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Subscription>}
 */
const updateSubscriptionById = async (id, updateBody) => {
    const user = await getSubscriptionById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Subscription>}
 */
const deleteSubscriptionById = async (id) => {
    const user = await getSubscriptionById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
    }
    await user.remove();
    return user;
};

module.exports = {
    createSubscription,
    querySubscription,
    getSubscriptionById,
    getSubscriptionDetail,
    updateSubscriptionById,
    deleteSubscriptionById,
};
