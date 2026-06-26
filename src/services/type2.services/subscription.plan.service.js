const httpStatus = require('http-status');
const { SubscriptionPlan } = require('../../models');
const ApiError = require('../../utils/ApiError');


/**
 * Calculate Final Amount
 */
const calculateFinalAmount = (amount, discountType, discountValue) => {
  let finalAmount = amount;

  if (discountType === 'percentage') {
    finalAmount = amount - (amount * discountValue) / 100;
  } else if (discountType === 'fixed') {
    finalAmount = amount - discountValue;
  }

  if (finalAmount < 0) {
    finalAmount = 0;
  }

  return Number(finalAmount.toFixed(2));
};

/**
 * Create Subscription Plan
 * @param {Object} subscriptionBody
 * @returns {Promise<SubscriptionPlan>}
 */
const createSubscriptionPlan = async (subscriptionBody) => {
  // Check duplicate plan name
  if (await SubscriptionPlan.isPlanNameTaken(subscriptionBody.planName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Name already exists');
  }

  // Check duplicate plan code
  if (await SubscriptionPlan.isPlanCodeTaken(subscriptionBody.planCode)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Code already exists');
  }

  subscriptionBody.finalAmount = calculateFinalAmount(
    subscriptionBody.amount,
    subscriptionBody.discountType,
    subscriptionBody.discountValue
  );

  const subscription = await SubscriptionPlan.create(subscriptionBody);

  return subscription;
};

/**
 * Query Subscription Plans
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const querySubscriptionPlans = async (filter, options) => {
  filter.isDeleted = false;

  const subscriptions = await SubscriptionPlan.paginate(filter, options);

  return subscriptions;
};

/**
 * Get Subscription By Id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getSubscriptionPlanById = async (id) => {
  return SubscriptionPlan.findOne({
    _id: id,
    isDeleted: false,
  });
};

/**
 * Update Subscription Plan By Id
 * @param {ObjectId} subscriptionPlanId
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateSubscriptionPlanById = async (subscriptionPlanId, updateBody) => {
  const subscription = await getSubscriptionPlanById(subscriptionPlanId);

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription Plan not found');
  }

  // Check duplicate plan name
  if (
    updateBody.planName &&
    (await SubscriptionPlan.isPlanNameTaken(
      updateBody.planName,
      subscriptionPlanId
    ))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Plan Name already exists'
    );
  }

  // Check duplicate plan code
  if (
    updateBody.planCode &&
    (await SubscriptionPlan.isPlanCodeTaken(
      updateBody.planCode,
      subscriptionPlanId
    ))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Plan Code already exists'
    );
  }

  // Merge updated values
  Object.assign(subscription, updateBody);

  // Recalculate final amount
  subscription.finalAmount = calculateFinalAmount(
    subscription.amount,
    subscription.discountType,
    subscription.discountValue
  );

  await subscription.save();

  return subscription;
};

/**
 * Delete Subscription Plan (Soft Delete)
 * @param {ObjectId} subscriptionPlanId
 * @returns {Promise<SubscriptionPlan>}
 */
const deleteSubscriptionPlanById = async (
  subscriptionPlanId
) => {
  const subscription =
    await getSubscriptionPlanById(subscriptionPlanId);

  if (!subscription) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Subscription Plan not found'
    );
  }

  subscription.isDeleted = true;
  subscription.status = 'inactive';

  await subscription.save();

  return subscription;
};

/**
 * Change Status
 * @param {ObjectId} subscriptionPlanId
 * @param {String} status
 * @returns {Promise<SubscriptionPlan>}
 */
const changeStatus = async (
  subscriptionPlanId,
  status
) => {
  const subscription =
    await getSubscriptionPlanById(subscriptionPlanId);

  if (!subscription) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Subscription Plan not found'
    );
  }

  subscription.status = status;

  await subscription.save();

  return subscription;
};
/**
 * Get All Active Subscription Plans
 * @returns {Promise<Array>}
 */
const getActivePlans = async () => {
  return SubscriptionPlan.find({
    status: 'active',
    isDeleted: false,
  })
    .sort({ amount: 1 })
    .select('-isDeleted -__v');
};

/**
 * Subscription Dropdown
 * Used while creating payment/order
 * @returns {Promise<Array>}
 */
const getSubscriptionDropdown = async () => {
  return SubscriptionPlan.find({
    status: 'active',
    isDeleted: false,
  })
    .select('_id planName planCode finalAmount validity validityType')
    .sort({ amount: 1 });
};

module.exports = {
  createSubscriptionPlan,
  querySubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlanById,
  deleteSubscriptionPlanById,
  changeStatus,
  getActivePlans,
  getSubscriptionDropdown,
};