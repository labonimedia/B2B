const httpStatus = require('http-status');
const { Subscription } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Subscription
 * @param {Object} reqBody
 * @returns {Promise<Subscription>}
 */
const createSubscription = async (reqBody) => {
  return Subscription.create(reqBody);
};

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
  updateSubscriptionById,
  deleteSubscriptionById,
};
