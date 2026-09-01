const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemPackingMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Packing Masters
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
  const packings = await weaverItemPackingMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(packings);
});

/**
 * Create Weaver Item Packing Master
 */
const createWeaverItemPackingMaster = catchAsync(async (req, res) => {
  const packing = await weaverItemPackingMasterService.createWeaverItemPackingMaster(req.body);

  res.status(httpStatus.CREATED).send(packing);
});

/**
 * Query Weaver Item Packing Masters
 */
const queryWeaverItemPackingMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'remark', 'rate', 'code', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemPackingMasterService.queryWeaverItemPackingMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Packing Master by ID
 */
const getWeaverItemPackingMasterById = catchAsync(async (req, res) => {
  const packing = await weaverItemPackingMasterService.getWeaverItemPackingMasterById(req.params.id);

  if (!packing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Packing Master not found');
  }

  res.send(packing);
});

/**
 * Search Weaver Item Packing Masters
 */
const searchWeaverItemPackingMaster = catchAsync(async (req, res) => {
  const result = await weaverItemPackingMasterService.searchWeaverItemPackingMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Packing Master
 */
const updateWeaverItemPackingMasterById = catchAsync(async (req, res) => {
  const packing = await weaverItemPackingMasterService.updateWeaverItemPackingMasterById(req.params.id, req.body);

  res.send(packing);
});

/**
 * Delete Weaver Item Packing Master
 */
const deleteWeaverItemPackingMasterById = catchAsync(async (req, res) => {
  await weaverItemPackingMasterService.deleteWeaverItemPackingMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemPackingMaster,
  queryWeaverItemPackingMaster,
  getWeaverItemPackingMasterById,
  searchWeaverItemPackingMaster,
  updateWeaverItemPackingMasterById,
  deleteWeaverItemPackingMasterById,
};
