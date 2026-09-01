const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemColorShadeMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Color Shade Masters
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
  const colorShades = await weaverItemColorShadeMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(colorShades);
});

/**
 * Create Weaver Item Color Shade Master
 */
const createWeaverItemColorShadeMaster = catchAsync(async (req, res) => {
  const colorShade = await weaverItemColorShadeMasterService.createWeaverItemColorShadeMaster(req.body);

  res.status(httpStatus.CREATED).send(colorShade);
});

/**
 * Query Weaver Item Color Shade Masters
 */
const queryWeaverItemColorShadeMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'remark', 'code', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemColorShadeMasterService.queryWeaverItemColorShadeMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Color Shade Master by ID
 */
const getWeaverItemColorShadeMasterById = catchAsync(async (req, res) => {
  const colorShade = await weaverItemColorShadeMasterService.getWeaverItemColorShadeMasterById(req.params.id);

  if (!colorShade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Color Shade Master not found');
  }

  res.send(colorShade);
});

/**
 * Search Weaver Item Color Shade Masters
 */
const searchWeaverItemColorShadeMaster = catchAsync(async (req, res) => {
  const result = await weaverItemColorShadeMasterService.searchWeaverItemColorShadeMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Color Shade Master
 */
const updateWeaverItemColorShadeMasterById = catchAsync(async (req, res) => {
  const colorShade = await weaverItemColorShadeMasterService.updateWeaverItemColorShadeMasterById(req.params.id, req.body);

  res.send(colorShade);
});

/**
 * Delete Weaver Item Color Shade Master
 */
const deleteWeaverItemColorShadeMasterById = catchAsync(async (req, res) => {
  await weaverItemColorShadeMasterService.deleteWeaverItemColorShadeMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemColorShadeMaster,
  queryWeaverItemColorShadeMaster,
  getWeaverItemColorShadeMasterById,
  searchWeaverItemColorShadeMaster,
  updateWeaverItemColorShadeMasterById,
  deleteWeaverItemColorShadeMasterById,
};
