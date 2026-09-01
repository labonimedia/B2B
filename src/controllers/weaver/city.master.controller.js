const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverCityMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver City Masters
 */
const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing file');
  }

  /**
   * Validate CSV file
   */
  const fileName = req.file.originalname || '';

  const fileExtension = path.extname(fileName).toLowerCase();

  if (fileExtension !== '.csv') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only CSV files are allowed');
  }

  /**
   * Get uploaded CSV path
   */
  const csvFilePath = join(uploadsFolder, req.file.filename);

  /**
   * Convert CSV to JSON
   */
  const csvJsonArray = await csv().fromFile(csvFilePath);

  /**
   * Bulk upload
   */
  const cities = await weaverCityMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(cities);
});

/**
 * Create Weaver City Master
 */
const createWeaverCityMaster = catchAsync(async (req, res) => {
  const city = await weaverCityMasterService.createWeaverCityMaster(req.body);

  res.status(httpStatus.CREATED).send(city);
});

/**
 * Query Weaver City Masters
 */
const queryWeaverCityMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'stateName', 'cityCode', 'wholeSaleRate', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverCityMasterService.queryWeaverCityMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver City Master by ID
 */
const getWeaverCityMasterById = catchAsync(async (req, res) => {
  const city = await weaverCityMasterService.getWeaverCityMasterById(req.params.id);

  if (!city) {
    throw new ApiError(httpStatus.NOT_FOUND, 'City Master not found');
  }

  res.send(city);
});

/**
 * Search Weaver City Masters
 */
const searchWeaverCityMaster = catchAsync(async (req, res) => {
  const result = await weaverCityMasterService.searchWeaverCityMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver City Master
 */
const updateWeaverCityMasterById = catchAsync(async (req, res) => {
  const city = await weaverCityMasterService.updateWeaverCityMasterById(req.params.id, req.body);

  res.send(city);
});

/**
 * Delete Weaver City Master
 */
const deleteWeaverCityMasterById = catchAsync(async (req, res) => {
  await weaverCityMasterService.deleteWeaverCityMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverCityMaster,
  queryWeaverCityMaster,
  getWeaverCityMasterById,
  searchWeaverCityMaster,
  updateWeaverCityMasterById,
  deleteWeaverCityMasterById,
};
