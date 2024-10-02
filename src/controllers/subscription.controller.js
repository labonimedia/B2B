const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subcriptionService } = require('../services');

const createSubscription = catchAsync(async (req, res) => {
  const user = await subcriptionService.createSubscription(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySubscription = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subcriptionService.querySubscription(filter, options);
  res.send(result);
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const user = await subcriptionService.getSubscriptionById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TopType not found');
  }
  res.send(user);
});

const updateSubscriptionById = catchAsync(async (req, res) => {
  const user = await subcriptionService.updateSubscriptionById(req.params.id, req.body);
  res.send(user);
});

const deleteSubscriptionById = catchAsync(async (req, res) => {
  await subcriptionService.deleteSubscriptionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createSubscription,
  querySubscription,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
};
