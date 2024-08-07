const httpStatus = require('http-status');
const pick = require('../utils/pick');
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

// const queryCollarStyle = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await cartService.queryCollarStyle(filter, options);
//   res.send(result);
// });

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
  addToCart,
  getCartByEmail,
  //   queryCollarStyle,
  //   getCollarStyleById,
  //   updateCollarStyleById,
  //   deleteCollarStyleById,
  addToCart,
  getCartByEmail,
  //   queryCollarStyle,
  getCartById,
  updateCartById,
  deleteCartById,
};
