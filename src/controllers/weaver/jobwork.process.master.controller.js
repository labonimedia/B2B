const httpStatus = require('http-status');

const path = require('path');

const csv = require('csvtojson');

const { join } = require('path');

const pick = require('../../utils/pick');

const ApiError = require('../../utils/ApiError');

const catchAsync = require('../../utils/catchAsync');

const { weaverJobworkProcessMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Jobwork Process Master
 */
const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing file');
  }

  const csvFilePath = join(uploadsFolder, req.file.filename);

  const csvJsonArray = await csv().fromFile(csvFilePath);

  const processes = await weaverJobworkProcessMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(processes);
});

/**
 * Create Jobwork Process Master
 */
const createWeaverJobworkProcessMaster = catchAsync(async (req, res) => {
  const process = await weaverJobworkProcessMasterService.createWeaverJobworkProcessMaster(req.body);

  res.status(httpStatus.CREATED).send(process);
});

/**
 * Query Jobwork Process Masters
 */
const queryWeaverJobworkProcessMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['processCode', 'processName', 'processType', 'weaverId', 'weaverEmail', 'isActive']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverJobworkProcessMasterService.queryWeaverJobworkProcessMaster(filter, options);

  res.send(result);
});

/**
 * Get Jobwork Process Master by ID
 */
const getWeaverJobworkProcessMasterById = catchAsync(async (req, res) => {
  const process = await weaverJobworkProcessMasterService.getWeaverJobworkProcessMasterById(req.params.id);

  res.send(process);
});

/**
 * Search Jobwork Process Masters
 */
const searchWeaverJobworkProcessMaster = catchAsync(async (req, res) => {
  const result = await weaverJobworkProcessMasterService.searchWeaverJobworkProcessMaster(req.body);

  res.send(result);
});

/**
 * Update Jobwork Process Master
 */
const updateWeaverJobworkProcessMasterById = catchAsync(async (req, res) => {
  const process = await weaverJobworkProcessMasterService.updateWeaverJobworkProcessMasterById(req.params.id, req.body);

  res.send(process);
});

/**
 * Delete Jobwork Process Master
 */
const deleteWeaverJobworkProcessMasterById = catchAsync(async (req, res) => {
  await weaverJobworkProcessMasterService.deleteWeaverJobworkProcessMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverJobworkProcessMaster,
  queryWeaverJobworkProcessMaster,
  getWeaverJobworkProcessMasterById,
  searchWeaverJobworkProcessMaster,
  updateWeaverJobworkProcessMasterById,
  deleteWeaverJobworkProcessMasterById,
};
