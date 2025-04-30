const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { RetailerCartType2Service } = require('../../services');

const createRetailerCartType2 = catchAsync(async (req, res) => {
  const createdItems = await RetailerCartType2Service.createRetailerCartType2(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryRetailerCartType2 = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const cartType2Items = await RetailerCartType2Service.queryRetailerCartType2(filter, options);
  res.status(httpStatus.OK).send(cartType2Items);
});

const getRetailerCartType2ById = catchAsync(async (req, res) => {
  const cartItem = await RetailerCartType2Service.getRetailerCartType2ById(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getCartByEmailToPlaceOrder = catchAsync(async (req, res) => {
  const { email, productBy } = req.query;

  const cart = await RetailerCartType2Service.getCartByEmailToPlaceOrder(email, productBy);
  res.status(httpStatus.OK).send(cart);
});

const getCartByEmail = catchAsync(async (req, res) => {
  const { email } = req.query;

  const cart = await RetailerCartType2Service.getCartByEmail(email);
  res.status(httpStatus.OK).send(cart);
});

const genratePORetailerCartType2 = catchAsync(async (req, res) => {
  const cart = await RetailerCartType2Service.genratePORetailerCartType2(req.params.id);
  res.status(httpStatus.OK).send(cart);
});

const updateRetailerCartType2ById = catchAsync(async (req, res) => {
  const updatedCartItem = await RetailerCartType2Service.updateRetailerCartType2ById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteRetailerCartType2ById = catchAsync(async (req, res) => {
  await RetailerCartType2Service.deleteRetailerCartType2ById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});
const deleteCartSetItem = catchAsync(async (req, res) => {
  const { cartId, setId } = req.params;
  await RetailerCartType2Service.deleteCartSetItem(cartId, setId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRetailerCartType2,
  queryRetailerCartType2,
  getRetailerCartType2ById,
  getCartByEmail,
  genratePORetailerCartType2,
  getCartByEmailToPlaceOrder,
  updateRetailerCartType2ById,
  deleteRetailerCartType2ById,
  deleteCartSetItem
};
