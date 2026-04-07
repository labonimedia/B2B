const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { channelPartnerService } = require('../services');

const registerChannelPartner = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.registerChannelPartner(req.body);
  res.status(httpStatus.CREATED).send(cp);
});

const getAllChannelPartners = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'status',
    'city',
    'state',
    'country',
    'email',
    'mobNumber',
    'companyName',
    'fullName',
    'role',
    'retailer',
    'invitedBy',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await channelPartnerService.queryChannelPartners(filter, options);
  res.send(result);
});

const getChannelPartnerByEmail = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.getByEmail(req.params.email);
  if (!cp) throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  res.send(cp);
});

const updateChannelPartner = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.updateByEmail(req.params.email, req.body);
  res.send(cp);
});

const deleteChannelPartner = catchAsync(async (req, res) => {
  await channelPartnerService.deleteByEmail(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const addRetailer = catchAsync(async (req, res) => {
  const cp = await channelPartnerService.addRetailer(req.user.email, req.body);
  res.send(cp);
});

const getRetailers = catchAsync(async (req, res) => {
  const retailers = await channelPartnerService.getRetailers(req.user.email);
  res.send(retailers);
});

const linkManufacturer = catchAsync(async (req, res) => {
  const result = await channelPartnerService.linkManufacturer(req.body, req.user);
  res.send(result);
});

const assignCommission = catchAsync(async (req, res) => {
  const { email, id, commissionGivenBy, category, productCommission, shippingCommission } = req.body;

  const result = await channelPartnerService.assignOrUpdateCommission(
    email,
    id,
    commissionGivenBy,
    category,
    productCommission,
    shippingCommission
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Commission assigned successfully',
    data: result,
  });
});

const getCommissionByGivenBy = catchAsync(async (req, res) => {
  const { channelPartnerId, commissionGivenBy } = req.params;

  const result = await channelPartnerService.getCommissionByGivenBy(channelPartnerId, commissionGivenBy);

  res.status(httpStatus.OK).send({
    success: true,
    data: result,
  });
});

module.exports = {
  registerChannelPartner,
  getAllChannelPartners,
  getChannelPartnerByEmail,
  updateChannelPartner,
  deleteChannelPartner,
  addRetailer,
  getRetailers,
  linkManufacturer,
  getCommissionByGivenBy,
  assignCommission,
};
