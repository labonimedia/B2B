const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { cartType2Service } = require('../../services');


const createCartType2 = catchAsync(async (req, res) => {
  const createdItems = await cartType2Service.createCartType2(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryCartType2 = catchAsync(async (req, res) => {
  const filter = req.query; // Use query params for filtering
  const options = {
    limit: parseInt(req.query.limit, 10) || 10,
    page: parseInt(req.query.page, 10) || 1,
    sortBy: req.query.sortBy,
  };

  const cartType2Items = await cartType2Service.queryCartType2(filter, options);
  res.status(httpStatus.OK).send(cartType2Items);
});

const getCartType2ById = catchAsync(async (req, res) => {
  const cartItem = await cartType2Service.getCartType2ById(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateCartType2ById = catchAsync(async (req, res) => {
  const updatedCartItem = await cartType2Service.updateCartType2ById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteCartType2ById = catchAsync(async (req, res) => {
  await cartType2Service.deleteCartType2ById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCartType2,
  queryCartType2,
  getCartType2ById,
  updateCartType2ById,
  deleteCartType2ById,
};