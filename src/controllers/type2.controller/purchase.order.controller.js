const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { purchaseOrderType2Service } = require('../../services');

const createPurchaseOrderType2 = catchAsync(async (req, res) => {
  const createdItems = await purchaseOrderType2Service.createPurchaseOrderType2(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryPurchaseOrderType2 = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const PurchaseOrderType2Items = await purchaseOrderType2Service.queryPurchaseOrderType2(filter, options);
  res.status(httpStatus.OK).send(PurchaseOrderType2Items);
});

const getPurchaseOrderType2ById = catchAsync(async (req, res) => {
  const cartItem = await purchaseOrderType2Service.getPurchaseOrderType2ById(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getProductOrderBySupplyer = catchAsync(async (req, res) => {
  const cartItem = await purchaseOrderType2Service.getProductOrderBySupplyer(req.query.supplierEmail);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updatePurchaseOrderType2ById = catchAsync(async (req, res) => {
  const updatedCartItem = await purchaseOrderType2Service.updatePurchaseOrderType2ById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deletePurchaseOrderType2ById = catchAsync(async (req, res) => {
  await purchaseOrderType2Service.deletePurchaseOrderType2ById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPurchaseOrdersByManufactureEmail = async (req, res) => {
  const { manufacturerEmail, page, limit, sortBy, filter } = req.query;
  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sortBy: sortBy || '-createdAt', // default sorting by newest first
  };

  const data = await purchaseOrderType2Service.getPurchaseOrdersByManufactureEmail(manufacturerEmail, filter, options);
  res.status(200).send({ success: true, data });
};

module.exports = {
  createPurchaseOrderType2,
  queryPurchaseOrderType2,
  getPurchaseOrderType2ById,
  getProductOrderBySupplyer,
  updatePurchaseOrderType2ById,
  deletePurchaseOrderType2ById,
  getPurchaseOrdersByManufactureEmail
};
