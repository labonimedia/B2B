const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { wholesalerPriceService } = require('../../services');

const createWholesalerPrice = catchAsync(async (req, res) => {
  const createdItems = await wholesalerPriceService.createOrUpdateWholesalerPriceType2(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryWholesalerPrice = catchAsync(async (req, res) => {
  //   const filter = pick(req.query, ['productBy', 'email']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const cartType2Items = await wholesalerPriceService.queryWholesalerPriceType2(req.query.wholesalerEmail, options);
  res.status(httpStatus.OK).send(cartType2Items);
});

const getWholesalerPriceById = catchAsync(async (req, res) => {
  const cartItem = await wholesalerPriceService.getWholesalerPriceType2ById(req.params.productId);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wholesaler price not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getWholesalerPriceType2ByIdWholesaler = catchAsync(async (req, res) => {
  const cartItem = await wholesalerPriceService.getWholesalerPriceType2ByIdWholesaler(req.query.productId, req.query.wholesalerEmail);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wholesaler price not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getFilteredProducts = catchAsync(async (req, res) => {
  const cartItem = await wholesalerPriceService.getFilteredProducts(req.body);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wholesaler price not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getRetailerPriceById = catchAsync(async (req, res) => {
  const cartItem = await wholesalerPriceService.getRetailerPriceById(req.query.productId, req.query.wholesalerEmail);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wholesaler price not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateWholesalerPriceById = catchAsync(async (req, res) => {
  const updatedCartItem = await wholesalerPriceService.updateWholesalerPriceType2ById(req.params.productId, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteWholesalerPriceById = catchAsync(async (req, res) => {
  await wholesalerPriceService.deleteWholesalerPriceType2ById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWholesalerPrice,
  queryWholesalerPrice,
  getFilteredProducts,
  getWholesalerPriceById,
  getWholesalerPriceType2ByIdWholesaler,
  getRetailerPriceById,
  updateWholesalerPriceById,
  deleteWholesalerPriceById,
};
