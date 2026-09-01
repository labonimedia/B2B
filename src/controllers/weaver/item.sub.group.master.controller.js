const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemSubGroupMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Sub Group Masters
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

  const subGroups = await weaverItemSubGroupMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(subGroups);
});

/**
 * Create Weaver Item Sub Group Master
 */
const createWeaverItemSubGroupMaster = catchAsync(async (req, res) => {
  const subGroup = await weaverItemSubGroupMasterService.createWeaverItemSubGroupMaster(req.body);

  res.status(httpStatus.CREATED).send(subGroup);
});

/**
 * Query Weaver Item Sub Group Masters
 */
const queryWeaverItemSubGroupMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'default', 'remark', 'code', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemSubGroupMasterService.queryWeaverItemSubGroupMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Sub Group Master by ID
 */
const getWeaverItemSubGroupMasterById = catchAsync(async (req, res) => {
  const subGroup = await weaverItemSubGroupMasterService.getWeaverItemSubGroupMasterById(req.params.id);

  if (!subGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Sub Group Master not found');
  }

  res.send(subGroup);
});

/**
 * Search Weaver Item Sub Group Masters
 */
const searchWeaverItemSubGroupMaster = catchAsync(async (req, res) => {
  const result = await weaverItemSubGroupMasterService.searchWeaverItemSubGroupMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Sub Group Master
 */
const updateWeaverItemSubGroupMasterById = catchAsync(async (req, res) => {
  const subGroup = await weaverItemSubGroupMasterService.updateWeaverItemSubGroupMasterById(req.params.id, req.body);

  res.send(subGroup);
});

/**
 * Delete Weaver Item Sub Group Master
 */
const deleteWeaverItemSubGroupMasterById = catchAsync(async (req, res) => {
  await weaverItemSubGroupMasterService.deleteWeaverItemSubGroupMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemSubGroupMaster,
  queryWeaverItemSubGroupMaster,
  getWeaverItemSubGroupMasterById,
  searchWeaverItemSubGroupMaster,
  updateWeaverItemSubGroupMasterById,
  deleteWeaverItemSubGroupMasterById,
};
