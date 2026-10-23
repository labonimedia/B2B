const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemStockTypeMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Stock Type Masters
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
  const stockTypes = await weaverItemStockTypeMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(stockTypes);
});

/**
 * Create Weaver Item Stock Type Master
 */
const createWeaverItemStockTypeMaster = catchAsync(async (req, res) => {
  const stockType = await weaverItemStockTypeMasterService.createWeaverItemStockTypeMaster(req.body);

  res.status(httpStatus.CREATED).send(stockType);
});

/**
 * Query Weaver Item Stock Type Masters
 */
const queryWeaverItemStockTypeMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'default', 'remark', 'code', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemStockTypeMasterService.queryWeaverItemStockTypeMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Stock Type Master by ID
 */
const getWeaverItemStockTypeMasterById = catchAsync(async (req, res) => {
  const stockType = await weaverItemStockTypeMasterService.getWeaverItemStockTypeMasterById(req.params.id);

  if (!stockType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Stock Type Master not found');
  }

  res.send(stockType);
});

/**
 * Search Weaver Item Stock Type Masters
 */
const searchWeaverItemStockTypeMaster = catchAsync(async (req, res) => {
  const result = await weaverItemStockTypeMasterService.searchWeaverItemStockTypeMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Stock Type Master
 */
const updateWeaverItemStockTypeMasterById = catchAsync(async (req, res) => {
  const stockType = await weaverItemStockTypeMasterService.updateWeaverItemStockTypeMasterById(req.params.id, req.body);

  res.send(stockType);
});

/**
 * Delete Weaver Item Stock Type Master
 */
const deleteWeaverItemStockTypeMasterById = catchAsync(async (req, res) => {
  await weaverItemStockTypeMasterService.deleteWeaverItemStockTypeMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemStockTypeMaster,
  queryWeaverItemStockTypeMaster,
  getWeaverItemStockTypeMasterById,
  searchWeaverItemStockTypeMaster,
  updateWeaverItemStockTypeMasterById,
  deleteWeaverItemStockTypeMasterById,
};
