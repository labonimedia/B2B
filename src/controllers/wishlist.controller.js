const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { wishlistService } = require('../services');

const createWishlist = catchAsync(async (req, res) => {
  const user = await wishlistService.createWishlist(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWishlist = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['email', 'productId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wishlistService.queryWishlist(filter, options);
  res.send(result);
});

const getWishlistById = catchAsync(async (req, res) => {
  const user = await wishlistService.getWishlistById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }
  res.send(user);
});
const checkWishlistById = catchAsync(async (req, res) => {
    const {productId, email} = req.query;
    const user = await wishlistService.checkWishlistById(productId, email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
    }
    res.send(user);
  });

  const getWishlistByEmail = catchAsync(async (req, res) => {
    const { email } = req.params;
    const products = await wishlistService.getWishlistByEmail(email);
    res.status(httpStatus.OK).send(products);
  });

const updateWishlistById = catchAsync(async (req, res) => {
  const user = await wishlistService.updateWishlistById(req.params.id, req.body);
  res.send(user);
});

const deleteWishlistById = catchAsync(async (req, res) => {
  await wishlistService.deleteWishlistById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWishlist,
  queryWishlist,
  getWishlistById,
  getWishlistByEmail,
  checkWishlistById,
  updateWishlistById,
  deleteWishlistById,
};
