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

const updateSetItem = catchAsync(async (req, res) => {
  const data = await cpCartService.updateSetItem(req.params.cartId, req.params.setId, req.body);
  res.send(data);
});

const deleteItem = catchAsync(async (req, res) => {
  const data = await cpCartService.deleteItem(req.params.cartId, req.params.setId);
  res.send(data);
});

module.exports = {
  addToCart,
  getCart,
  updateSetItem,
  deleteItem,
};
