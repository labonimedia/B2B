const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { returnOrderService } = require('../services');

const createReturnOrder = catchAsync(async (req, res) => {
  const returnOrder = await returnOrderService.createReturnOrder(req.body);
  res.status(httpStatus.CREATED).send(returnOrder);
});

const queryReturnOrder = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await returnOrderService.queryReturnOrder(filter, options);
  res.send(result);
});

const getReturnOrderById = catchAsync(async (req, res) => {
  const returnOrder = await returnOrderService.getReturnOrderById(req.params.id);
  if (!returnOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Elastic not found');
  }
  res.send(returnOrder);
});

const updateReturnOrderById = catchAsync(async (req, res) => {
  const returnOrder = await returnOrderService.updateReturnOrderById(req.params.id, req.body);
  res.send(returnOrder);
});

const deleteReturnOrderById = catchAsync(async (req, res) => {
  await returnOrderService.deleteReturnOrderById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReturnOrder,
  queryReturnOrder,
  getReturnOrderById,
  updateReturnOrderById,
  deleteReturnOrderById,
};
