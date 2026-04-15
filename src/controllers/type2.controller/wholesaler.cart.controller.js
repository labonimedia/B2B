// const httpStatus = require('http-status');
// const catchAsync = require('../../utils/catchAsync');
// const ApiError = require('../../utils/ApiError');
// const { wholesalerCartToManufacturerService } = require('../../services');

// const addToCart = catchAsync(async (req, res) => {
//   const result = await wholesalerCartToManufacturerService.createWholesalerCart(req.body);
//   res.status(httpStatus.CREATED).send(result);
// });

// // const getCartByWholesaler = catchAsync(async (req, res) => {
// //   const { wholesalerEmail } = req.query;

// //   const result = await wholesalerCartToManufacturerService.getCartByWholesaler(wholesalerEmail);

// //   res.status(httpStatus.OK).send(result);
// // });

// const getCartByWholesaler = async (req, res) => {

//   const filter = {};

//   if (req.query.wholesalerEmail) {
//     filter.wholesalerEmail = req.query.wholesalerEmail;
//   }

//   const options = {
//     page: parseInt(req.query.page) || 1,
//     limit: parseInt(req.query.limit) || 10,
//   };

//   const result = await wholesalerCartToManufacturerService.queryWholesalerCart(filter, options);

//   res.send(result);
// };

// const getSingleCart = catchAsync(async (req, res) => {
//   const result = await wholesalerCartToManufacturerService.getCartById(req.params.id);

//   if (!result) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
//   }

//   res.status(httpStatus.OK).send(result);
// });

// const updateCart = catchAsync(async (req, res) => {
//   const result = await wholesalerCartToManufacturerService.updateCart(req.params.id, req.body);

//   res.status(httpStatus.OK).send(result);
// });

// const deleteCart = catchAsync(async (req, res) => {
//   await wholesalerCartToManufacturerService.deleteCart(req.params.id);

//   res.status(httpStatus.NO_CONTENT).send();
// });

// const updateCartSetItem = catchAsync(async (req, res) => {
//   const result = await wholesalerCartToManufacturerService.updateCartSetItem(req.params.cartId, req.body);

//   res.status(httpStatus.OK).send(result);
// });

// module.exports = {
//   addToCart,
//   getCartByWholesaler,
//   getSingleCart,
//   updateCart,
//   deleteCart,
//   updateCartSetItem,
// };

const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { wholesalerCartToManufacturerService } = require('../../services');

const createCart = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.createCart(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const queryCart = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'wholesalerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await wholesalerCartToManufacturerService.queryCart(filter, options);

  res.status(httpStatus.OK).send(result);
});

const getCartById = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.getCartById(req.params.id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  res.send(result);
});

const getCartByEmail = catchAsync(async (req, res) => {
  const { wholesalerEmail } = req.query;

  const result = await wholesalerCartToManufacturerService.getCartByEmail(wholesalerEmail);

  res.send(result);
});

const getCartByEmailToPlaceOrder = catchAsync(async (req, res) => {
  const { wholesalerEmail, manufacturerEmail } = req.query;

  const result = await wholesalerCartToManufacturerService.getCartByEmailToPlaceOrder(wholesalerEmail, manufacturerEmail);

  res.send(result);
});

const updateCartById = catchAsync(async (req, res) => {
  const result = await wholesalerCartToManufacturerService.updateCartById(req.params.id, req.body);

  res.send(result);
});

const deleteCartById = catchAsync(async (req, res) => {
  await wholesalerCartToManufacturerService.deleteCartById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

const updateSetItem = catchAsync(async (req, res) => {
  const { cartId, setId } = req.params;

  const result = await wholesalerCartToManufacturerService.updateSetItem(cartId, setId, req.body);

  res.send(result);
});

const deleteCartSetItem = catchAsync(async (req, res) => {
  const { cartId, setId } = req.params;

  await wholesalerCartToManufacturerService.deleteCartSetItem(cartId, setId);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCart,
  queryCart,
  getCartByEmail,
  getCartByEmailToPlaceOrder,
  getCartById,
  updateCartById,
  deleteCartById,
  updateSetItem,
  deleteCartSetItem,
};
