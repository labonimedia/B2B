const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufacturerVendor } = require('../../models'); 

const generateNextVendorCode = async () => {
  const lastVendor = await ManufacturerVendor.findOne({ code: /^VND\d+$/ })
    .sort({ code: -1 }) // sort descending
    .lean();

  if (!lastVendor || !lastVendor.code) {
    return 'VND1';
  }

  const lastNumber = parseInt(lastVendor.code.replace('VND', ''), 10);
  const nextNumber = lastNumber + 1;

  return `VND${nextNumber}`;
};

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

  // Dupe check
  const existing = await ManufacturerVendor.findOne({ manufacturerEmail, vendorEmail });
  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Vendor already exists for this manufacturer with this email'
    );
  }

  // Generate unique vendor code auto
  vendorBody.code = await generateNextVendorCode();

  const vendor = await ManufacturerVendor.create(vendorBody);
  return vendor;
};

/**
 * Query vendors with pagination
 * filter: { manufacturerEmail, vendorName, companyName, isActive }
 */
const queryVendors = async (filter, options) => {
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
