const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverCashBankBookMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing file');
  }

  const csvFilePath = join(uploadsFolder, req.file.filename);

  const csvJsonArray = await csv().fromFile(csvFilePath);

  const books = await weaverCashBankBookMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(books);
});

const createWeaverCashBankBookMaster = catchAsync(async (req, res) => {
  const book = await weaverCashBankBookMasterService.createWeaverCashBankBookMaster(req.body);

  res.status(httpStatus.CREATED).send(book);
});

const queryWeaverCashBankBookMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'type',
    'bookNo',
    'accountName',
    'accountNo',
    'ifscCode',
    'branch',
    'weaverId',
    'weaverEmail',
    'isActive',
  ]);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverCashBankBookMasterService.queryWeaverCashBankBookMaster(filter, options);

  res.send(result);
});

const getWeaverCashBankBookMasterById = catchAsync(async (req, res) => {
  const book = await weaverCashBankBookMasterService.getWeaverCashBankBookMasterById(req.params.id);

  res.send(book);
});

const searchWeaverCashBankBookMaster = catchAsync(async (req, res) => {
  const result = await weaverCashBankBookMasterService.searchWeaverCashBankBookMaster(req.body);

  res.send(result);
});

const updateWeaverCashBankBookMasterById = catchAsync(async (req, res) => {
  const book = await weaverCashBankBookMasterService.updateWeaverCashBankBookMasterById(req.params.id, req.body);

  res.send(book);
});

const deleteWeaverCashBankBookMasterById = catchAsync(async (req, res) => {
  await weaverCashBankBookMasterService.deleteWeaverCashBankBookMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverCashBankBookMaster,
  queryWeaverCashBankBookMaster,
  getWeaverCashBankBookMasterById,
  searchWeaverCashBankBookMaster,
  updateWeaverCashBankBookMasterById,
  deleteWeaverCashBankBookMasterById,
};
