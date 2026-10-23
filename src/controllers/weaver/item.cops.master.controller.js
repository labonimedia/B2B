const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemCopsMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Cops Masters
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
  const cops = await weaverItemCopsMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(cops);
});

/**
 * Create Weaver Item Cops Master
 */
const createWeaverItemCopsMaster = catchAsync(async (req, res) => {
  const cops = await weaverItemCopsMasterService.createWeaverItemCopsMaster(req.body);

  res.status(httpStatus.CREATED).send(cops);
});

/**
 * Query Weaver Item Cops Masters
 */
const queryWeaverItemCopsMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'remark', 'code', 'weight', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemCopsMasterService.queryWeaverItemCopsMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Cops Master by ID
 */
const getWeaverItemCopsMasterById = catchAsync(async (req, res) => {
  const cops = await weaverItemCopsMasterService.getWeaverItemCopsMasterById(req.params.id);

  if (!cops) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Cops Master not found');
  }

  res.send(cops);
});

/**
 * Search Weaver Item Cops Masters
 */
const searchWeaverItemCopsMaster = catchAsync(async (req, res) => {
  const result = await weaverItemCopsMasterService.searchWeaverItemCopsMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Cops Master
 */
const updateWeaverItemCopsMasterById = catchAsync(async (req, res) => {
  const cops = await weaverItemCopsMasterService.updateWeaverItemCopsMasterById(req.params.id, req.body);

  res.send(cops);
});

/**
 * Delete Weaver Item Cops Master
 */
const deleteWeaverItemCopsMasterById = catchAsync(async (req, res) => {
  await weaverItemCopsMasterService.deleteWeaverItemCopsMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemCopsMaster,
  queryWeaverItemCopsMaster,
  getWeaverItemCopsMasterById,
  searchWeaverItemCopsMaster,
  updateWeaverItemCopsMasterById,
  deleteWeaverItemCopsMasterById,
};
