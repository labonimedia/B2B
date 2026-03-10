const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { wholesalerCartToManufacturerService } = require('../../services');

const addToCart = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.createWholesalerCart(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getCartByWholesaler = catchAsync(async (req, res) => {
  const { wholesalerEmail } = req.query;

  const result = await wholesalerCartToManufacturerService.getCartByWholesaler(wholesalerEmail);

  res.status(httpStatus.OK).send(result);
});

const getSingleCart = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.getCartById(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  res.status(httpStatus.OK).send(result);
});

const updateCart = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.updateCart(req.params.id, req.body);

  res.status(httpStatus.OK).send(result);
});

const deleteCart = catchAsync(async (req, res) => {
  await wholesalerCartToManufacturerService.deleteCart(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

const updateCartSetItem = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.updateCartSetItem(req.params.cartId, req.body);

  res.status(httpStatus.OK).send(result);
});

module.exports = {
  addToCart,
  getCartByWholesaler,
  getSingleCart,
  updateCart,
  deleteCart,
  updateCartSetItem,
};
