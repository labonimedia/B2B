const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { wholesalerService } = require('../services');

const createWholesaler = catchAsync(async (req, res) => {
  const user = await wholesalerService.createWholesaler(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWholesaler = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status',]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wholesalerService.queryWholesaler(filter, options);
  res.send(result);
});

const getWholesalerById = catchAsync(async (req, res) => {
  const user = await wholesalerService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  }
  res.send(user);
});

const updateWholesalerById = catchAsync(async (req, res) => {
  const user = await wholesalerService.updateWholesalerById(req.params.email, req.body);
  res.send(user);
});

const deleteWholesalerById = catchAsync(async (req, res) => {
  await wholesalerService.deleteWholesalerById(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWholesaler,
  queryWholesaler,
  getWholesalerById,
  updateWholesalerById,
  deleteWholesalerById,
};
