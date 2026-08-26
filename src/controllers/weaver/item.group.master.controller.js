const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const {
  weaverItemGroupMasterService,
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
 * Bulk Upload Weaver Item Group Masters
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
     * Bulk upload
     */
    const itemGroups =
      await weaverItemGroupMasterService.bulkUpload(
        csvJsonArray,
        req.user
      );

    res
      .status(httpStatus.CREATED)
      .send(itemGroups);
  }
);

/**
 * Create Weaver Item Group Master
 */
const createWeaverItemGroupMaster =
  catchAsync(
    async (req, res) => {
      const itemGroup =
        await weaverItemGroupMasterService.createWeaverItemGroupMaster(
          req.body
        );

      res
        .status(httpStatus.CREATED)
        .send(itemGroup);
    }
  );

/**
 * Query Weaver Item Group Masters
 */
const queryWeaverItemGroupMaster =
  catchAsync(
    async (req, res) => {
      const filter = pick(
        req.query,
        [
          'name',
          'code',
          'remark',
          'default',
          'weaverId',
          'weaverEmail',
        ]
      );

      const options = pick(
        req.query,
        [
          'sortBy',
          'limit',
          'page',
        ]
      );

      const result =
        await weaverItemGroupMasterService.queryWeaverItemGroupMaster(
          filter,
          options
        );

      res.send(result);
    }
  );

/**
 * Get Weaver Item Group Master by ID
 */
const getWeaverItemGroupMasterById =
  catchAsync(
    async (req, res) => {
      const itemGroup =
        await weaverItemGroupMasterService.getWeaverItemGroupMasterById(
          req.params.id
        );

      if (!itemGroup) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Item Group Master not found'
        );
      }

      res.send(itemGroup);
    }
  );

/**
 * Search Weaver Item Group Masters
 */
const searchWeaverItemGroupMaster =
  catchAsync(
    async (req, res) => {
      const result =
        await weaverItemGroupMasterService.searchWeaverItemGroupMaster(
          req.body
        );

      res.send(result);
    }
  );

/**
 * Update Weaver Item Group Master
 */
const updateWeaverItemGroupMasterById =
  catchAsync(
    async (req, res) => {
      const itemGroup =
        await weaverItemGroupMasterService.updateWeaverItemGroupMasterById(
          req.params.id,
          req.body
        );

      res.send(itemGroup);
    }
  );

/**
 * Delete Weaver Item Group Master
 */
const deleteWeaverItemGroupMasterById =
  catchAsync(
    async (req, res) => {
      await weaverItemGroupMasterService.deleteWeaverItemGroupMasterById(
        req.params.id
      );

      res
        .status(httpStatus.NO_CONTENT)
        .send();
    }
  );

module.exports = {
  bulkUploadFile,
  createWeaverItemGroupMaster,
  queryWeaverItemGroupMaster,
  getWeaverItemGroupMasterById,
  searchWeaverItemGroupMaster,
  updateWeaverItemGroupMasterById,
  deleteWeaverItemGroupMasterById,
};