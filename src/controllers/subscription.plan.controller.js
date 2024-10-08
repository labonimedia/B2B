const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subscriptionPlanService } = require('../services');

const createSubscriptionPlan = catchAsync(async (req, res) => {
  const user = await subscriptionPlanService.createSubscriptionPlan(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySubscriptionPlan = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subscriptionPlanService.querySubscriptionPlan(filter, options);
  res.send(result);
});

const getSubscriptionPlanById = catchAsync(async (req, res) => {
  const user = await subscriptionPlanService.getSubscriptionPlanById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TopType not found');
  }
  res.send(user);
});

const updateSubscriptionPlanById = catchAsync(async (req, res) => {
  const user = await subscriptionPlanService.updateSubscriptionPlanById(req.params.id, req.body);
  res.send(user);
});

const deleteSubscriptionPlanById = catchAsync(async (req, res) => {
  await subscriptionPlanService.deleteSubscriptionPlanById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubscriptionPlan,
  querySubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlanById,
  deleteSubscriptionPlanById,
};
