const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { wishListType2Service } = require('../../services');

const createWishListType2Schema = catchAsync(async (req, res) => {
  const user = await wishListType2Service.createWishListType2Schema(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWishListType2Schema = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['email', 'productId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wishListType2Service.queryWishListType2Schema(filter, options);
  res.send(result);
});

const getWishListType2SchemaById = catchAsync(async (req, res) => {
  const user = await wishListType2Service.getWishListType2SchemaById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WishListType2Schema not found');
  }
  res.send(user);
});
const checkWishListType2SchemaById = catchAsync(async (req, res) => {
  const { productId, email } = req.body;
  const user = await wishListType2Service.checkWishListType2SchemaById(productId, email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WishListType2Schema not found');
  }
  res.send(user);
});

const getWishListType2SchemaByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const products = await wishListType2Service.getWishListType2SchemaByEmail(email);
  res.status(httpStatus.OK).send(products);
});

const updateWishListType2SchemaById = catchAsync(async (req, res) => {
  const user = await wishListType2Service.updateWishListType2SchemaById(req.params.id, req.body);
  res.send(user);
});

const deleteWishListType2SchemaById = catchAsync(async (req, res) => {
  await wishListType2Service.deleteWishListType2SchemaById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWishListType2Schema,
  queryWishListType2Schema,
  getWishListType2SchemaById,
  getWishListType2SchemaByEmail,
  checkWishListType2SchemaById,
  updateWishListType2SchemaById,
  deleteWishListType2SchemaById,
};
