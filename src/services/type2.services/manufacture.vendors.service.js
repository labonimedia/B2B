const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufacturerVendor } = require('../../models'); // ensure exported in models/index.js

/**
 * Create a vendor for a manufacturer
 */
const createVendor = async (vendorBody) => {
  const { manufacturerEmail, vendorEmail } = vendorBody;

  if (!manufacturerEmail || !vendorEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'manufacturerEmail and vendorEmail are required'
    );
  }

  // Optional extra duplicate check (unique index will also enforce)
  const existing = await ManufacturerVendor.findOne({ manufacturerEmail, vendorEmail });
  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Vendor already exists for this manufacturer with this email'
    );
  }

  const vendor = await ManufacturerVendor.create(vendorBody);
  return vendor;
};

/**
 * Query vendors with pagination
 * filter: { manufacturerEmail, vendorName, companyName, isActive }
 */
const queryVendors = async (filter, options) => {
  if (filter.isActive === undefined) {
    filter.isActive = true;
  }
  const vendors = await ManufacturerVendor.paginate(filter, options);
  return vendors;
};

/**
 * Get vendor by id
 */
const getVendorById = async (id) => {
  return ManufacturerVendor.findById(id);
};

/**
 * Update vendor by id
 */
const updateVendorById = async (vendorId, updateBody) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  Object.assign(vendor, updateBody);
  await vendor.save();
  return vendor;
};

/**
 * Delete vendor by id (soft delete: set isActive=false)
 */
const deleteVendorById = async (vendorId) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  vendor.isActive = false;
  await vendor.save();
  return vendor;
};

module.exports = {
  createVendor,
  queryVendors,
  getVendorById,
  updateVendorById,
  deleteVendorById,
};
