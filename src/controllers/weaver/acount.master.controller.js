const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const {
  weaverAcountMasterService,
} = require('../../services');

const staticFolder = path.join(
  __dirname,
  '../../'
);

const uploadsFolder = path.join(
  staticFolder,
  'uploads'
);

/**
 * Bulk Upload Weaver Account Masters
 * from CSV file
 */
const bulkUploadFile = catchAsync(
  async (req, res) => {
    if (!req.file) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Missing file'
      );
    }

    /**
     * Validate CSV file
     */
    const fileName =
      req.file.originalname || '';

    const fileExtension =
      path.extname(fileName).toLowerCase();

    if (fileExtension !== '.csv') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Only CSV files are allowed'
      );
    }

    /**
     * Get uploaded CSV path
     */
    const csvFilePath = join(
      uploadsFolder,
      req.file.filename
    );

    /**
     * Convert CSV to JSON
     */
    const csvJsonArray =
      await csv().fromFile(
        csvFilePath
      );

    /**
     * Bulk upload records
     */
    const accounts =
      await weaverAcountMasterService.bulkUpload(
        csvJsonArray,
        req.user
      );

    res
      .status(httpStatus.CREATED)
      .send(accounts);
  }
);

/**
 * Create Weaver Account Master
 */
const createWeaverAcountMaster = catchAsync(
  async (req, res) => {
    const user =
      await weaverAcountMasterService.createWeaverAcountMaster(
        req.body
      );

    res
      .status(httpStatus.CREATED)
      .send(user);
  }
);

/**
 * Query Weaver Account Masters
 */
const queryWeaverAcountMaster = catchAsync(
  async (req, res) => {
    const filter = pick(req.query, [
      'name',
      'weaverId',
      'weaverEmail',
      'groupName',
      'groupId',
      'isActive',
    ]);

    const options = pick(req.query, [
      'sortBy',
      'limit',
      'page',
    ]);

    const result =
      await weaverAcountMasterService.queryWeaverAcountMaster(
        filter,
        options
      );

    res.send(result);
  }
);

/**
 * Get Weaver Account Master by ID
 */
const getWeaverAcountMasterById = catchAsync(
  async (req, res) => {
    const user =
      await weaverAcountMasterService.getWeaverAcountMasterById(
        req.params.id
      );

    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Account Master not found'
      );
    }

    res.send(user);
  }
);

/**
 * Search Weaver Account Masters
 */
const searchWeaverAcountMaster = catchAsync(
  async (req, res) => {
    const result =
      await weaverAcountMasterService.searchWeaverAcountMaster(
        req.body
      );

    res.send(result);
  }
);

/**
 * Update Weaver Account Master by ID
 */
const updateWeaverAcountMasterById = catchAsync(
  async (req, res) => {
    const user =
      await weaverAcountMasterService.updateWeaverAcountMasterById(
        req.params.id,
        req.body
      );

    res.send(user);
  }
);

/**
 * Delete Weaver Account Master by ID
 */
const deleteWeaverAcountMasterById = catchAsync(
  async (req, res) => {
    await weaverAcountMasterService.deleteWeaverAcountMasterById(
      req.params.id
    );

    res
      .status(httpStatus.NO_CONTENT)
      .send();
  }
);

module.exports = {
  bulkUploadFile,
  createWeaverAcountMaster,
  queryWeaverAcountMaster,
  getWeaverAcountMasterById,
  searchWeaverAcountMaster,
  updateWeaverAcountMasterById,
  deleteWeaverAcountMasterById,
};