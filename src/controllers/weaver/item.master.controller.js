const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Masters
 */
const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing file');
  }

  const fileName = req.file.originalname || '';

  const fileExtension = path.extname(fileName).toLowerCase();

  if (fileExtension !== '.csv') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only CSV files are allowed');
  }

  const csvFilePath = join(uploadsFolder, req.file.filename);

  const csvJsonArray = await csv().fromFile(csvFilePath);

  const items = await weaverItemMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(items);
});

/**
 * Create Weaver Item Master
 */
const createWeaverItemMaster = catchAsync(async (req, res) => {
  const item = await weaverItemMasterService.createWeaverItemMaster(req.body);

  res.status(httpStatus.CREATED).send(item);
});

/**
 * Query Weaver Item Masters
 */
const queryWeaverItemMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'name',
    'itemCode',
    'shortName',
    'groupId',
    'subGroupId',
    'itemTypeId',
    'itemStockTypeId',
    'weaverId',
    'weaverEmail',
    'isActive',
  ]);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemMasterService.queryWeaverItemMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Master by ID
 */
const getWeaverItemMasterById = catchAsync(async (req, res) => {
  const item = await weaverItemMasterService.getWeaverItemMasterById(req.params.id);

  res.send(item);
});

/**
 * Search Weaver Item Masters
 */
const searchWeaverItemMaster = catchAsync(async (req, res) => {
  const result = await weaverItemMasterService.searchWeaverItemMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Master
 */
const updateWeaverItemMasterById = catchAsync(async (req, res) => {
  const item = await weaverItemMasterService.updateWeaverItemMasterById(req.params.id, req.body);

  res.send(item);
});

/**
 * Delete Weaver Item Master
 */
const deleteWeaverItemMasterById = catchAsync(async (req, res) => {
  await weaverItemMasterService.deleteWeaverItemMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemMaster,
  queryWeaverItemMaster,
  getWeaverItemMasterById,
  searchWeaverItemMaster,
  updateWeaverItemMasterById,
  deleteWeaverItemMasterById,
};
