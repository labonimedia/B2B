const httpStatus = require('http-status');
const path = require('path');
const csv = require('csvtojson');
const { join } = require('path');

const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const {
  weaverFormulaMasterService,
} = require('../../services');

const staticFolder = path.join(
  __dirname,
  '../../'
);

const uploadsFolder = path.join(
  staticFolder,
  'uploads'
);

const bulkUploadFile = catchAsync(
  async (req, res) => {
    if (!req.file) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Missing file'
      );
    }

    const csvFilePath = join(
      uploadsFolder,
      req.file.filename
    );

    const csvJsonArray =
      await csv().fromFile(
        csvFilePath
      );

    const formulas =
      await weaverFormulaMasterService.bulkUpload(
        csvJsonArray,
        req.user
      );

    res
      .status(httpStatus.CREATED)
      .send(formulas);
  }
);

const createWeaverFormulaMaster =
  catchAsync(async (req, res) => {
    const formula =
      await weaverFormulaMasterService.createWeaverFormulaMaster(
        req.body,
        req.user
      );

    res
      .status(httpStatus.CREATED)
      .send(formula);
  });

const queryWeaverFormulaMaster =
  catchAsync(async (req, res) => {
    const filter = pick(req.query, [
      'name',
      'weaverId',
      'weaverEmail',
    ]);

    const options = pick(req.query, [
      'sortBy',
      'limit',
      'page',
    ]);

    const result =
      await weaverFormulaMasterService.queryWeaverFormulaMaster(
        filter,
        options
      );

    res.send(result);
  });

const getWeaverFormulaMasterById =
  catchAsync(async (req, res) => {
    const formula =
      await weaverFormulaMasterService.getWeaverFormulaMasterById(
        req.params.id
      );

    res.send(formula);
  });

const searchWeaverFormulaMaster =
  catchAsync(async (req, res) => {
    const result =
      await weaverFormulaMasterService.searchWeaverFormulaMaster(
        req.body
      );

    res.send(result);
  });

const updateWeaverFormulaMasterById =
  catchAsync(async (req, res) => {
    const formula =
      await weaverFormulaMasterService.updateWeaverFormulaMasterById(
        req.params.id,
        req.body
      );

    res.send(formula);
  });

const deleteWeaverFormulaMasterById =
  catchAsync(async (req, res) => {
    await weaverFormulaMasterService.deleteWeaverFormulaMasterById(
      req.params.id
    );

    res
      .status(httpStatus.NO_CONTENT)
      .send();
  });

module.exports = {
  bulkUploadFile,
  createWeaverFormulaMaster,
  queryWeaverFormulaMaster,
  getWeaverFormulaMasterById,
  searchWeaverFormulaMaster,
  updateWeaverFormulaMasterById,
  deleteWeaverFormulaMasterById,
};