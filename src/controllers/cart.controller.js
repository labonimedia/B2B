const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const addToCart = catchAsync(async (req, res) => {
  const { email, productBy, productId, quantity } = req.body;
  const product = await cartService.addToCart(email, productBy, productId, quantity);
  res.status(httpStatus.CREATED).send(product);
});

const getCartByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const cart = await cartService.getCartByEmail(email);
  res.status(httpStatus.OK).send(cart);
});

const getCartByEmailToPlaceOrder = catchAsync(async (req, res) => {
  const { email, productBy } = req.query;

  const cart = await cartService.getCartByEmailToPlaceOrder(email, productBy);
  res.status(httpStatus.OK).send(cart);
});

const getCartById = catchAsync(async (req, res) => {
  const user = await cartService.getCartById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.send(user);
});

const updateCartById = catchAsync(async (req, res) => {
  const { email, productId, quantity } = req.query;
  const user = await cartService.updateCartByEmail(email, productId, quantity);
  res.send(user);
});

const deleteCartById = catchAsync(async (req, res) => {
  const { email, productId } = req.query;
  await cartService.deleteCartItemByEmail(email, productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getCartByEmail,
  addToCart,
  getCartByEmailToPlaceOrder,
  getCartById,
  updateCartById,
  deleteCartById,
};
