const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { channelPartnerCustomerService } = require('../services');

/**
 * 🔥 Bulk Upload
 */
const bulkUpload = catchAsync(async (req, res) => {
  const data = req.body;
  const cpEmail = req.user.email; // from auth

  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Body must be non-empty array');
  }

  const result = await channelPartnerCustomerService.bulkUploadRetailers(data, cpEmail);

  res.status(httpStatus.CREATED).send({
    message: 'Retailers uploaded successfully',
    result,
  });
});

/**
 * ➕ Add Single
 */
const addRetailer = catchAsync(async (req, res) => {
  const cpEmail = req.body.email;

  const result = await channelPartnerCustomerService.addRetailer(cpEmail, req.body);

  res.status(httpStatus.CREATED).send(result);
});

/**
 * 📄 Query
 */
const queryRetailers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['channelPartnerEmail', 'retailerEmail', 'city', 'state']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await channelPartnerCustomerService.queryRetailers(filter, options);

  res.send(result);
});

/**
 * 🔍 Get by ID
 */
const getRetailerById = catchAsync(async (req, res) => {
  const data = await channelPartnerCustomerService.getRetailerById(req.params.id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }

  res.send(data);
});

/**
 * ✏️ Update
 */
const updateRetailerById = catchAsync(async (req, res) => {
  const data = await channelPartnerCustomerService.updateRetailerById(
    req.params.id,
    req.body
  );

  res.send(data);
});

/**
 * ❌ Delete
 */
const deleteRetailerById = catchAsync(async (req, res) => {
  await channelPartnerCustomerService.deleteRetailerById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUpload,
  addRetailer,
  queryRetailers,
  getRetailerById,
  updateRetailerById,
  deleteRetailerById,
};