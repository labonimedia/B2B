const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverItemLotDesignMasterService } = require('../../services');

const staticFolder = path.join(__dirname, '../../');

const uploadsFolder = path.join(staticFolder, 'uploads');

/**
 * Bulk Upload Weaver Item Lot Design Masters
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
  const lotDesigns = await weaverItemLotDesignMasterService.bulkUpload(csvJsonArray, req.user);

  res.status(httpStatus.CREATED).send(lotDesigns);
});

/**
 * Create Weaver Item Lot Design Master
 */
const createWeaverItemLotDesignMaster = catchAsync(async (req, res) => {
  const lotDesign = await weaverItemLotDesignMasterService.createWeaverItemLotDesignMaster(req.body);

  res.status(httpStatus.CREATED).send(lotDesign);
});

/**
 * Query Weaver Item Lot Design Masters
 */
const queryWeaverItemLotDesignMaster = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'remark', 'code', 'weaverId', 'weaverEmail']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await weaverItemLotDesignMasterService.queryWeaverItemLotDesignMaster(filter, options);

  res.send(result);
});

/**
 * Get Weaver Item Lot Design Master by ID
 */
const getWeaverItemLotDesignMasterById = catchAsync(async (req, res) => {
  const lotDesign = await weaverItemLotDesignMasterService.getWeaverItemLotDesignMasterById(req.params.id);

  if (!lotDesign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Lot Design Master not found');
  }

  res.send(lotDesign);
});

/**
 * Search Weaver Item Lot Design Masters
 */
const searchWeaverItemLotDesignMaster = catchAsync(async (req, res) => {
  const result = await weaverItemLotDesignMasterService.searchWeaverItemLotDesignMaster(req.body);

  res.send(result);
});

/**
 * Update Weaver Item Lot Design Master
 */
const updateWeaverItemLotDesignMasterById = catchAsync(async (req, res) => {
  const lotDesign = await weaverItemLotDesignMasterService.updateWeaverItemLotDesignMasterById(req.params.id, req.body);

  res.send(lotDesign);
});

/**
 * Delete Weaver Item Lot Design Master
 */
const deleteWeaverItemLotDesignMasterById = catchAsync(async (req, res) => {
  await weaverItemLotDesignMasterService.deleteWeaverItemLotDesignMasterById(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  bulkUploadFile,
  createWeaverItemLotDesignMaster,
  queryWeaverItemLotDesignMaster,
  getWeaverItemLotDesignMasterById,
  searchWeaverItemLotDesignMaster,
  updateWeaverItemLotDesignMasterById,
  deleteWeaverItemLotDesignMasterById,
};
