const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const {
  weaverTransporterMasterService,
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
 * Bulk Upload Weaver Transporter Masters
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
    const transporters =
      await weaverTransporterMasterService.bulkUpload(
        csvJsonArray,
        req.user
      );

    res
      .status(httpStatus.CREATED)
      .send(transporters);
  }
);

/**
 * Create Weaver Transporter Master
 */
const createWeaverTransporterMaster =
  catchAsync(
    async (req, res) => {
      const transporter =
        await weaverTransporterMasterService.createWeaverTransporterMaster(
          req.body
        );

      res
        .status(httpStatus.CREATED)
        .send(transporter);
    }
  );

/**
 * Query Weaver Transporter Masters
 */
const queryWeaverTransporterMaster =
  catchAsync(
    async (req, res) => {
      const filter = pick(
        req.query,
        [
          'name',
          'contactNo',
          'district',
          'address',
          'gstNo',
          'city',
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
        await weaverTransporterMasterService.queryWeaverTransporterMaster(
          filter,
          options
        );

      res.send(result);
    }
  );

/**
 * Get Weaver Transporter Master by ID
 */
const getWeaverTransporterMasterById =
  catchAsync(
    async (req, res) => {
      const transporter =
        await weaverTransporterMasterService.getWeaverTransporterMasterById(
          req.params.id
        );

      if (!transporter) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Transporter Master not found'
        );
      }

      res.send(transporter);
    }
  );

/**
 * Search Weaver Transporter Masters
 */
const searchWeaverTransporterMaster =
  catchAsync(
    async (req, res) => {
      const result =
        await weaverTransporterMasterService.searchWeaverTransporterMaster(
          req.body
        );

      res.send(result);
    }
  );

/**
 * Update Weaver Transporter Master
 */
const updateWeaverTransporterMasterById =
  catchAsync(
    async (req, res) => {
      const transporter =
        await weaverTransporterMasterService.updateWeaverTransporterMasterById(
          req.params.id,
          req.body
        );

      res.send(transporter);
    }
  );

/**
 * Delete Weaver Transporter Master
 */
const deleteWeaverTransporterMasterById =
  catchAsync(
    async (req, res) => {
      await weaverTransporterMasterService.deleteWeaverTransporterMasterById(
        req.params.id
      );

      res
        .status(httpStatus.NO_CONTENT)
        .send();
    }
  );

module.exports = {
  bulkUploadFile,
  createWeaverTransporterMaster,
  queryWeaverTransporterMaster,
  getWeaverTransporterMasterById,
  searchWeaverTransporterMaster,
  updateWeaverTransporterMasterById,
  deleteWeaverTransporterMasterById,
};