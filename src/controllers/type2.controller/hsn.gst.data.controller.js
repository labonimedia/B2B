const path = require('path');
const { join } = require('path');
const httpStatus = require('http-status');
const csv = require('csvtojson');
const { gstHsnService } = require('../../services');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const staticFolder = path.join(__dirname, '../../uploads');
const uploadsFolder = path.join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const staff = await gstHsnService.bulkUpload(null, csvJsonArray);
    res.status(httpStatus.CREATED).send(staff);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const arrayUpload = catchAsync(async (req, res) => {
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const result = await gstHsnService.bulkUploadHsnGst(data);
  res.status(httpStatus.CREATED).send({ message: 'Bulk upload completed', result });
});

// /**
//  * GET /api/hsn
//  * Get list of GST HSN codes, optional filters & pagination
//  */
// const getHsnCodes = catchAsync(async (req, res) => {
//   // Example: Allow query params like `limit`, `page`, or `search`
//   const filter = pick(req.query, ['hsnCode']); // extend filters as needed
//   const options = pick(req.query, ['limit', 'page', 'sortBy']);

//   const result = await gstHsnService.queryHsnCodes(filter, options);
//    res.status(httpStatus.CREATED).send(result);
// });
const getHsnCodes = catchAsync(async (req, res) => {
  const filter = {};
  const options = pick(req.query, ['limit', 'page', 'sortBy']);

  // If hsnCode is provided, use regex for partial match
  if (req.query.hsnCode) {
    filter.hsnCode = { $regex: req.query.hsnCode, $options: 'i' }; // case-insensitive
  }

  const result = await gstHsnService.queryHsnCodes(filter, options);
  res.status(httpStatus.OK).send(result);
});

/**
 * GET /api/hsn/:hsnCode
 * Get details of specific HSN code
 */

/**
 * Get a single M2R Invoice by ID
 */
const getHsnCodeDetails = catchAsync(async (req, res) => {
  const hsnDetails = await gstHsnService.getHsnCodeByCode(req.params.hsnCode);
  if (!hsnDetails) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'HSN code not found' });
    return;
  }
  res.send(hsnDetails);
});
module.exports = {
  getHsnCodes,
  getHsnCodeDetails,
  bulkUploadFile,
  arrayUpload,
};
