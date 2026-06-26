const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { subscriptionPlanService } = require('../../services');

/**
 * Create Subscription Plan
 */
const createSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.createSubscriptionPlan(req.body);

  res.status(httpStatus.CREATED).send(subscriptionPlan);
});

/**
 * Get All Subscription Plans
 */
const getSubscriptionPlans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['planName', 'planCode', 'status', 'isPopular', 'isRecommended']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await subscriptionPlanService.querySubscriptionPlans(filter, options);

  res.status(httpStatus.OK).send(result);
});

/**
 * Get Subscription Plan By Id
 */
const getSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.getSubscriptionPlanById(req.params.subscriptionPlanId);

  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription Plan not found');
  }

  res.status(httpStatus.OK).send(subscriptionPlan);
});

/**
 * Update Subscription Plan
 */
const updateSubscriptionPlan = catchAsync(async (req, res) => {
  const updatedSubscription = await subscriptionPlanService.updateSubscriptionPlanById(
    req.params.subscriptionPlanId,
    req.body
  );

  res.status(httpStatus.OK).send(updatedSubscription);
});

/**
 * Delete Subscription Plan
 */
const deleteSubscriptionPlan = catchAsync(async (req, res) => {
  await subscriptionPlanService.deleteSubscriptionPlanById(req.params.subscriptionPlanId);

  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Change Plan Status
 */
const changeStatus = catchAsync(async (req, res) => {
  const subscription = await subscriptionPlanService.changeStatus(req.params.subscriptionPlanId, req.body.status);

  res.status(httpStatus.OK).send(subscription);
});

/**
 * Get Active Plans
 */
const getActivePlans = catchAsync(async (req, res) => {
  const plans = await subscriptionPlanService.getActivePlans();

  res.status(httpStatus.OK).send(plans);
});

/**
 * Dropdown API
 */
const getSubscriptionDropdown = catchAsync(async (req, res) => {
  const plans = await subscriptionPlanService.getSubscriptionDropdown();

  res.status(httpStatus.OK).send(plans);
});

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  changeStatus,
  getActivePlans,
  getSubscriptionDropdown,
};
