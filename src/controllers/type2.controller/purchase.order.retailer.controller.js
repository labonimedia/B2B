const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { RetailerPurchaseOrderType2Service } = require('../../services');

const createRetailerPurchaseOrderType2 = catchAsync(async (req, res) => {
  const createdItems = await RetailerPurchaseOrderType2Service.createPurchaseOrderRetailerType2(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryRetailerPurchaseOrderType2 = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'wholesalerEmail','email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const RetailerPurchaseOrderType2Items = await RetailerPurchaseOrderType2Service.queryPurchaseOrderRetailerType2(filter, options);
  res.status(httpStatus.OK).send(RetailerPurchaseOrderType2Items);
});

const getRetailerPurchaseOrderType2ById = catchAsync(async (req, res) => {
  const cartItem = await RetailerPurchaseOrderType2Service.getPurchaseOrderRetailerType2ById(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const combinePurchaseOrders = catchAsync(async (req, res) => {
  const cartItem = await RetailerPurchaseOrderType2Service.combinePurchaseOrders(req.query.wholesaleremail);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const combinePurchaseOrdersForManufacturer = catchAsync(async (req, res) => {
  const cartItem = await RetailerPurchaseOrderType2Service.combinePurchaseOrdersForManufacturer(req.query.wholesaleremail, req.query.productBy);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getProductOrderBySupplyer = catchAsync(async (req, res) => {
  const cartItem = await RetailerPurchaseOrderType2Service.getProductOrderBySupplyer(req.query.supplierEmail);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateRetailerPurchaseOrderType2ById = catchAsync(async (req, res) => {
  const updatedCartItem = await RetailerPurchaseOrderType2Service.updateRetailerPurchaseOrderType2ById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteRetailerPurchaseOrderType2ById = catchAsync(async (req, res) => {
  await RetailerPurchaseOrderType2Service.deleteRetailerPurchaseOrderType2ById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPurchaseOrdersByManufactureEmail = async (req, res) => {
  const { manufacturerEmail, page, limit, sortBy, filter } = req.query;
  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sortBy: sortBy || '-createdAt', // default sorting by newest first
  };
  const data = await RetailerPurchaseOrderType2Service.getProductOrderBySupplyer(manufacturerEmail, filter, options);
  res.status(200).send({ success: true, data });
};

module.exports = {
  createRetailerPurchaseOrderType2,
  queryRetailerPurchaseOrderType2,
  getRetailerPurchaseOrderType2ById,
  getProductOrderBySupplyer,
  combinePurchaseOrders,
  combinePurchaseOrdersForManufacturer,
  updateRetailerPurchaseOrderType2ById,
  deleteRetailerPurchaseOrderType2ById,
  getPurchaseOrdersByManufactureEmail,
};
