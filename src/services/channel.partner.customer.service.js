const httpStatus = require('http-status');
const { ChannelPartnerCustomer } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * 🔥 Bulk Upload Retailers
 */
const bulkUploadRetailers = async (dataArray, cpEmail) => {
  const formattedData = dataArray.map((item) => ({
    ...item,
    channelPartnerEmail: cpEmail,
    addedBy: cpEmail,
  }));

  const result = await ChannelPartnerCustomer.insertMany(formattedData, {
    ordered: false,
  });

  return result;
};

/**
 * ➕ Add Single Retailer
 */
const addRetailer = async (cpEmail, body) => {
  const { retailerEmail } = body;

  const exists = await ChannelPartnerCustomer.findOne({
    channelPartnerEmail: cpEmail,
    retailerEmail,
  });

  if (exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Retailer already added');
  }

  return ChannelPartnerCustomer.create({
    ...body,
    channelPartnerEmail: cpEmail,
    addedBy: cpEmail,
  });
};

/**
 * 📄 Query Retailers
 */
const queryRetailers = async (filter, options) => {
  return ChannelPartnerCustomer.paginate(filter, options);
};

/**
 * 🔍 Get by ID
 */
const getRetailerById = async (id) => {
  return ChannelPartnerCustomer.findById(id);
};

/**
 * ✏️ Update
 */
const updateRetailerById = async (id, updateBody) => {
  const retailer = await getRetailerById(id);

  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }

  Object.assign(retailer, updateBody);
  await retailer.save();

  return retailer;
};

/**
 * ❌ Delete
 */
const deleteRetailerById = async (id) => {
  const retailer = await getRetailerById(id);

  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }

  await retailer.remove();
  return retailer;
};

module.exports = {
  bulkUploadRetailers,
  addRetailer,
  queryRetailers,
  getRetailerById,
  updateRetailerById,
  deleteRetailerById,
};
