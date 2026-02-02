const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { retailerService } = require('../services');
const User = require('../models/user.model');

const fileupload = catchAsync(async (req, res) => {
  const user = await retailerService.fileupload(req, req.params.id);
  res.status(httpStatus.CREATED).send(user);
});

const createRetailer = catchAsync(async (req, res) => {
  const user = await retailerService.createRetailer(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryRetailer = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await retailerService.queryRetailer(filter, options);
  res.send(result);
});

const getRetailerById = catchAsync(async (req, res) => {
  const user = await retailerService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  res.send(user);
});

const updateRetailerById = catchAsync(async (req, res) => {
  const user = await retailerService.updateRetailerById(req.params.email, req.body);
  res.send(user);
});

const deleteRetailerById = catchAsync(async (req, res) => {
  await retailerService.deleteRetailerById(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const getWholesalersByRetailerId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userCategory } = req.query;
  const options = pick(req.query, ['limit', 'page']);
  const retailer = await retailerService.getUserById(id);
  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  const refByEmail = retailer.refByEmail || [];
  const wholesalers = await retailerService.getWholesalersByEmails(refByEmail, options, userCategory);
  res.status(httpStatus.OK).send(wholesalers);
});

const getManufactureByRetailerId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userCategory } = req.query;
  const options = pick(req.query, ['limit', 'page']);
  const retailer = await retailerService.getUserById(id);
  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  const refByEmail = retailer.refByEmail || [];
  const wholesalers = await retailerService.getManufacturerByEmails(refByEmail, options, userCategory);
  res.status(httpStatus.OK).send(wholesalers);
});

// const getRetailerPartnerCounts = catchAsync(async (req, res) => {
//   const { retailerId } = req.query;

//   // find retailer
//   const retailer = await User.findById(retailerId);
//   if (!retailer) {
//     return res.status(httpStatus.NOT_FOUND).send({
//       success: false,
//       message: 'Retailer not found',
//     });
//   }
//   // retailer connected emails
//   const connectedEmails = retailer.refByEmail || [];
//   const data = await retailerService.getRetailerPartnerDashboardCounts(connectedEmails);
//   res.status(httpStatus.OK).send({
//     success: true,
//     data,
//   });
// });

const getRetailerPartnerCounts = catchAsync(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'Retailer email is required',
    });
  }

  // 🔹 Find retailer by email
  const retailer = await User.findOne({ email, role: 'retailer' }).lean();

  if (!retailer) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'Retailer not found',
    });
  }

  // 🔹 Connected partner emails
  const connectedEmails = retailer.refByEmail || [];

  const data = await retailerService.getRetailerPartnerDashboardCounts(connectedEmails);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

module.exports = {
  createRetailer,
  queryRetailer,
  fileupload,
  getRetailerById,
  updateRetailerById,
  deleteRetailerById,
  getWholesalersByRetailerId,
  getManufactureByRetailerId,
  getRetailerPartnerCounts,
};
