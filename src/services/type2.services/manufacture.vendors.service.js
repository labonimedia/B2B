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

const createVendor = async (vendorBody) => {
  const { manufacturerEmail, vendorEmail } = vendorBody;

  if (!manufacturerEmail || !vendorEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and vendorEmail are required');
  }

  const existing = await ManufacturerVendor.findOne({ manufacturerEmail, vendorEmail });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vendor already exists for this manufacturer with this email');
  }
  vendorBody.code = await generateNextVendorCode();
  const vendor = await ManufacturerVendor.create(vendorBody);
  return vendor;
};

const queryVendors = async (filter, options) => {
  const vendors = await ManufacturerVendor.paginate(filter, options);
  return vendors;
};

const getVendorById = async (id) => {
  return ManufacturerVendor.findById(id);
};

const updateVendorById = async (vendorId, updateBody) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  Object.assign(vendor, updateBody);
  await vendor.save();
  return vendor;
};

const deleteVendorById = async (vendorId) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  vendor.isActive = false;
  await vendor.save();
  return vendor;
};

const deleteVendorPerment = async (id) => {
  const item = await getVendorById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  await item.remove();
  return item;
};

module.exports = {
  createVendor,
  queryVendors,
  getVendorById,
  updateVendorById,
  deleteVendorById,
  deleteVendorPerment,
};
