const httpStatus = require('http-status');

const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');

const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverMainGroupMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing file');
  }

  const csvFilePath = join(uploadsFolder, req.file.filename);

  const csvJsonArray = await csv().fromFile(csvFilePath);

  const groups = await weaverMainGroupMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(groups);
});

const createWeaverMainGroupMaster = catchAsync(async (req, res) => {
  const group = await weaverMainGroupMasterService.createWeaverMainGroupMaster(req.body);

  res.status(httpStatus.CREATED).send(group);
});

const queryWeaverMainGroupMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'mainGroupCode',
    'mainGroupName',
    'headCategory',
    'debitCredit',
    'weaverId',
    'weaverEmail',
  ]);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverMainGroupMasterService.queryWeaverMainGroupMaster(filter, options);

  res.send(result);
});

const getWeaverMainGroupMasterById = catchAsync(async (req, res) => {
  const group = await weaverMainGroupMasterService.getWeaverMainGroupMasterById(req.params.id);

  res.send(group);
});

const searchWeaverMainGroupMaster = catchAsync(async (req, res) => {
  const result = await weaverMainGroupMasterService.searchWeaverMainGroupMaster(req.body);

  res.send(result);
});

const updateWeaverMainGroupMasterById = catchAsync(async (req, res) => {
  const group = await weaverMainGroupMasterService.updateWeaverMainGroupMasterById(req.params.id, req.body);

  res.send(group);
});

const deleteWeaverMainGroupMasterById = catchAsync(async (req, res) => {
  await weaverMainGroupMasterService.deleteWeaverMainGroupMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverMainGroupMaster,
  queryWeaverMainGroupMaster,
  getWeaverMainGroupMasterById,
  searchWeaverMainGroupMaster,
  updateWeaverMainGroupMasterById,
  deleteWeaverMainGroupMasterById,
};
