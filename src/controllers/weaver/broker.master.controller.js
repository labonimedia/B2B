const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const {
  weaverBrokerMasterService,
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
 * Bulk Upload Weaver Broker Masters
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
    const brokers =
      await weaverBrokerMasterService.bulkUpload(
        csvJsonArray,
        req.user
      );

    res
      .status(httpStatus.CREATED)
      .send(brokers);
  }
);

/**
 * Create Weaver Broker Master
 */
const createWeaverBrokerMaster =
  catchAsync(
    async (req, res) => {
      const broker =
        await weaverBrokerMasterService.createWeaverBrokerMaster(
          req.body
        );

      res
        .status(httpStatus.CREATED)
        .send(broker);
    }
  );

/**
 * Query Weaver Broker Masters
 */
const queryWeaverBrokerMaster =
  catchAsync(
    async (req, res) => {
      const filter = pick(
        req.query,
        [
          'name',
          'contactNo',
          'district',
          'address',
          'default',
          'gstNo',
          'city',
          'pan',
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
        await weaverBrokerMasterService.queryWeaverBrokerMaster(
          filter,
          options
        );

      res.send(result);
    }
  );

/**
 * Get Weaver Broker Master by ID
 */
const getWeaverBrokerMasterById =
  catchAsync(
    async (req, res) => {
      const broker =
        await weaverBrokerMasterService.getWeaverBrokerMasterById(
          req.params.id
        );

      if (!broker) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Broker Master not found'
        );
      }

      res.send(broker);
    }
  );

/**
 * Search Weaver Broker Masters
 */
const searchWeaverBrokerMaster =
  catchAsync(
    async (req, res) => {
      const result =
        await weaverBrokerMasterService.searchWeaverBrokerMaster(
          req.body
        );

      res.send(result);
    }
  );

/**
 * Update Weaver Broker Master
 */
const updateWeaverBrokerMasterById =
  catchAsync(
    async (req, res) => {
      const broker =
        await weaverBrokerMasterService.updateWeaverBrokerMasterById(
          req.params.id,
          req.body
        );

      res.send(broker);
    }
  );

/**
 * Delete Weaver Broker Master
 */
const deleteWeaverBrokerMasterById =
  catchAsync(
    async (req, res) => {
      await weaverBrokerMasterService.deleteWeaverBrokerMasterById(
        req.params.id
      );

      res
        .status(httpStatus.NO_CONTENT)
        .send();
    }
  );

module.exports = {
  bulkUploadFile,
  createWeaverBrokerMaster,
  queryWeaverBrokerMaster,
  getWeaverBrokerMasterById,
  searchWeaverBrokerMaster,
  updateWeaverBrokerMasterById,
  deleteWeaverBrokerMasterById,
};