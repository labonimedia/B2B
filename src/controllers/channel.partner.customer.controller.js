const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { channelPartnerCustomerService } = require('../services');

const fileupload = catchAsync(async (req, res) => {
  const data = await channelPartnerCustomerService.fileupload(
    req,
    req.params.id
  );

  res.status(httpStatus.CREATED).send(data);
});
const createShopKeeper = catchAsync(async (req, res) => {
  const cpEmail = req.user.email;

  const result = await channelPartnerCustomerService.createShopKeeper(cpEmail, req.body);

  res.status(httpStatus.CREATED).send(result);
});

const queryShopKeepers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['channelPartnerEmail', 'email', 'city', 'state', 'status']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await channelPartnerCustomerService.queryShopKeepers(filter, options);

  res.send(result);
});

const getShopKeeperById = catchAsync(async (req, res) => {
  const data = await channelPartnerCustomerService.getShopKeeperById(req.params.id);

  res.send(data);
});

const updateShopKeeper = catchAsync(async (req, res) => {
  const data = await channelPartnerCustomerService.updateShopKeeper(req.params.id, req.body);

  res.send(data);
});

const deleteShopKeeper = catchAsync(async (req, res) => {
  const result = await channelPartnerCustomerService.deleteShopKeeper(req.params.id);

  res.send(result);
});

module.exports = {
  createShopKeeper,
  queryShopKeepers,
  getShopKeeperById,
  updateShopKeeper,
  deleteShopKeeper,
  fileupload,
};
