const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { manufacturerVendorService } = require('../../services');

// Create vendor
const createVendor = catchAsync(async (req, res) => {
  const vendor = await manufacturerVendorService.createVendor(req.body);
  res.status(httpStatus.CREATED).send(vendor);
});

// List / query vendors
const queryVendors = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'manufacturerEmail',
    'vendorEmail',
        'code',
    'vendorName',
    'companyName',
    'isActive',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manufacturerVendorService.queryVendors(filter, options);
  res.send(result);
});

// Get vendor by id
const getVendorById = catchAsync(async (req, res) => {
  const vendor = await manufacturerVendorService.getVendorById(req.params.id);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  res.send(vendor);
});

// Update vendor by id
const updateVendorById = catchAsync(async (req, res) => {
  const vendor = await manufacturerVendorService.updateVendorById(req.params.id, req.body);
  res.send(vendor);
});

// Delete vendor by id (soft delete)
const deleteVendorById = catchAsync(async (req, res) => {
  await manufacturerVendorService.deleteVendorById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteVendorPerment = catchAsync(async (req, res) => {
  await manufacturerVendorService.deleteVendorPerment(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createVendor,
  queryVendors,
  getVendorById,
  updateVendorById,
  deleteVendorById,
  deleteVendorPerment,
};
