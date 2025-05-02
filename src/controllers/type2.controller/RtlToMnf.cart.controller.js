const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { RtlToMnfCartService } = require('../../services');

const createCartType2 = catchAsync(async (req, res) => {
  const createdItems = await RtlToMnfCartService.createCartType2(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryCartType2 = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const cartType2Items = await RtlToMnfCartService.queryCartType2(filter, options);
  res.status(httpStatus.OK).send(cartType2Items);
});

const getCartType2ById = catchAsync(async (req, res) => {
  const cartItem = await RtlToMnfCartService.getCartType2ById(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const getCartByEmailToPlaceOrder = catchAsync(async (req, res) => {
  const { email, productBy } = req.query;

  const cart = await RtlToMnfCartService.getCartByEmailToPlaceOrder(email, productBy);
  res.status(httpStatus.OK).send(cart);
});

const getCartByEmail = catchAsync(async (req, res) => {
  const { email } = req.query;

  const cart = await RtlToMnfCartService.getCartByEmail(email);
  res.status(httpStatus.OK).send(cart);
});

const updateCartType2ById = catchAsync(async (req, res) => {
  const updatedCartItem = await RtlToMnfCartService.updateCartType2ById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteCartType2ById = catchAsync(async (req, res) => {
  await RtlToMnfCartService.deleteCartType2ById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});
const updateSetItem = catchAsync(async (req, res) => {
  const { cartId, setId } = req.params;
  const updatedCart = await RtlToMnfCartService.updateSetItem(cartId, setId, req.body);
  res.status(httpStatus.OK).send(updatedCart);
});

const deleteCartSetItem = catchAsync(async (req, res) => {
  const { cartId, setId } = req.params; 
   await RtlToMnfCartService. deleteCartSetItem(cartId, setId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCartType2,
  queryCartType2,
  getCartType2ById,
  getCartByEmail,
  getCartByEmailToPlaceOrder,
  updateCartType2ById,
  deleteCartType2ById,
  updateSetItem,
  deleteCartSetItem,
};
