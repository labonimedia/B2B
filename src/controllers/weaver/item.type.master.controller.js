const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemTypeMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Type Masters
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

  const csvFilePath = join(uploadsFolder, req.file.filename);

  const csvJsonArray = await csv().fromFile(csvFilePath);

  const itemTypes = await weaverItemTypeMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(itemTypes);
});

/**
 * Create Weaver Item Type Master
 */
const createWeaverItemTypeMaster = catchAsync(async (req, res) => {
  const itemType = await weaverItemTypeMasterService.createWeaverItemTypeMaster(req.body);

  res.status(httpStatus.CREATED).send(itemType);
});

/**
 * Query Weaver Item Type Masters
 */
const queryWeaverItemTypeMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'default', 'remark', 'code', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemTypeMasterService.queryWeaverItemTypeMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Type Master by ID
 */
const getWeaverItemTypeMasterById = catchAsync(async (req, res) => {
  const itemType = await weaverItemTypeMasterService.getWeaverItemTypeMasterById(req.params.id);

  if (!itemType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Type Master not found');
  }

  res.send(itemType);
});

/**
 * Search Weaver Item Type Masters
 */
const searchWeaverItemTypeMaster = catchAsync(async (req, res) => {
  const result = await weaverItemTypeMasterService.searchWeaverItemTypeMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Type Master
 */
const updateWeaverItemTypeMasterById = catchAsync(async (req, res) => {
  const itemType = await weaverItemTypeMasterService.updateWeaverItemTypeMasterById(req.params.id, req.body);

  res.send(itemType);
});

/**
 * Delete Weaver Item Type Master
 */
const deleteWeaverItemTypeMasterById = catchAsync(async (req, res) => {
  await weaverItemTypeMasterService.deleteWeaverItemTypeMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemTypeMaster,
  queryWeaverItemTypeMaster,
  getWeaverItemTypeMasterById,
  searchWeaverItemTypeMaster,
  updateWeaverItemTypeMasterById,
  deleteWeaverItemTypeMasterById,
};
