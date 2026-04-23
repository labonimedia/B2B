const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { cpCartService } = require('../../services');

const addToCart = catchAsync(async (req, res) => {
  const data = await cpCartService.addToCart(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const getCart = catchAsync(async (req, res) => {
  const { cpEmail, shopkeeperEmail } = req.query;
  const data = await cpCartService.getCart(cpEmail, shopkeeperEmail);
  res.send(data);
});

const updateItem = catchAsync(async (req, res) => {
  const data = await cpCartService.updateItem(req.body);
  res.send(data);
});

const deleteItem = catchAsync(async (req, res) => {
  const data = await cpCartService.deleteItem(req.body);
  res.send(data);
});

const applyDiscount = catchAsync(async (req, res) => {
  const data = await cpCartService.applyDiscount(req.body);
  res.send(data);
});

const confirmCart = catchAsync(async (req, res) => {
  const data = await cpCartService.confirmCart(req.params.cartId);
  res.send(data);
});

module.exports = {
  addToCart,
  getCart,
  updateItem,
  deleteItem,
  applyDiscount,
  confirmCart,
};