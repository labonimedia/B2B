const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverSalesPurchaseBookMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing file');
  }

  const csvFilePath = join(uploadsFolder, req.file.filename);

  const csvJsonArray = await csv().fromFile(csvFilePath);

  const books = await weaverSalesPurchaseBookMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(books);
});

const createWeaverSalesPurchaseBookMaster = catchAsync(async (req, res) => {
  const book = await weaverSalesPurchaseBookMasterService.createWeaverSalesPurchaseBookMaster(req.body);

  res.status(httpStatus.CREATED).send(book);
});

const queryWeaverSalesPurchaseBookMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['acType', 'bookNo', 'bookType', 'weaverId', 'weaverEmail', 'isActive']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverSalesPurchaseBookMasterService.queryWeaverSalesPurchaseBookMaster(filter, options);

  res.send(result);
});

const getWeaverSalesPurchaseBookMasterById = catchAsync(async (req, res) => {
  const book = await weaverSalesPurchaseBookMasterService.getWeaverSalesPurchaseBookMasterById(req.params.id);

  res.send(book);
});

const searchWeaverSalesPurchaseBookMaster = catchAsync(async (req, res) => {
  const result = await weaverSalesPurchaseBookMasterService.searchWeaverSalesPurchaseBookMaster(req.body);

  res.send(result);
});

const updateWeaverSalesPurchaseBookMasterById = catchAsync(async (req, res) => {
  const book = await weaverSalesPurchaseBookMasterService.updateWeaverSalesPurchaseBookMasterById(req.params.id, req.body);

  res.send(book);
});

const deleteWeaverSalesPurchaseBookMasterById = catchAsync(async (req, res) => {
  await weaverSalesPurchaseBookMasterService.deleteWeaverSalesPurchaseBookMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverSalesPurchaseBookMaster,
  queryWeaverSalesPurchaseBookMaster,
  getWeaverSalesPurchaseBookMasterById,
  searchWeaverSalesPurchaseBookMaster,
  updateWeaverSalesPurchaseBookMasterById,
  deleteWeaverSalesPurchaseBookMasterById,
};
