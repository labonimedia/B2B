const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { finalProductWService } = require('../../services');

const createFinalProductW = catchAsync(async (req, res) => {
  const returnOrder = await finalProductWService.createFinalProductW(req.body);
  res.status(httpStatus.CREATED).send(returnOrder);
});

const queryFinalProductW = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'email', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const returnOrders = await finalProductWService.queryFinalProductW(filter, options);
  res.status(httpStatus.OK).send(returnOrders);
});

const getFinalProductWById = catchAsync(async (req, res) => {
  const returnOrder = await finalProductWService.getFinalProductWById(req.params.id);
  if (!returnOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  res.status(httpStatus.OK).send(returnOrder);
});

const disctributeProductToRetailer = catchAsync(async (req, res) => {
  const finalProduct = await finalProductWService.disctributeProductToRetailer(req.params.Id);
  if (!finalProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  res.status(httpStatus.OK).send(finalProduct);
});

const updateFinalProductsById = catchAsync(async (req, res) => {
  const updatedProduct = await finalProductWService.updateFinalProductsById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedProduct);
});

module.exports = {
  createFinalProductW,
  queryFinalProductW,
  getFinalProductWById,
  disctributeProductToRetailer,
  updateFinalProductsById,
};
