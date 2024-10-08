const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dileveryOrderService } = require('../services');

const createDileveryOrder = catchAsync(async (req, res) => {
  const user = await dileveryOrderService.createDileveryOrder(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryDileveryOrder = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'productType', 'gender', 'category', 'subCategory']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await dileveryOrderService.queryDileveryOrder(filter, options);
  res.send(result);
});

const getDileveryOrderById = catchAsync(async (req, res) => {
  const user = await dileveryOrderService.getDileveryOrderById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder not found');
  }
  res.send(user);
});

const getDileveryOrderBycustomerEmail = catchAsync(async (req, res) => {
  const user = await dileveryOrderService.getDileveryOrderBycustomerEmail(req.query.customerEmail);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder not found');
  }
  res.send(user);
});

const getManufactureChalanNo = catchAsync(async (req, res) => {
  const user = await dileveryOrderService.getManufactureChalanNo(req.query.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }
  res.send(user);
});

const getGroupedProductsByStatus = catchAsync(async (req, res) => {
  const user = await dileveryOrderService.getGroupedProductsByStatus(req.query.customerEmail);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(user);
});

const updateDileveryOrderById = catchAsync(async (req, res) => {
  const user = await dileveryOrderService.updateDileveryOrderById(req.params.id, req.body);
  res.send(user);
});

const updateStatus = catchAsync(async (req, res) => {
  const { orderId, productId } = req.params;
  const user = await dileveryOrderService.updateStatus(orderId, productId, req.body.status);
  res.send(user);
});

const deleteDileveryOrderById = catchAsync(async (req, res) => {
  await dileveryOrderService.deleteDileveryOrderById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDileveryOrder,
  queryDileveryOrder,
  getManufactureChalanNo,
  getDileveryOrderById,
  updateStatus,
  getGroupedProductsByStatus,
  getDileveryOrderBycustomerEmail,
  updateDileveryOrderById,
  deleteDileveryOrderById,
};
