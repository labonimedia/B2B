const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  weaverManufacturerService,
} = require('../services');

/**
 * Create Weaver Manufacturer
 */
const createWeaverManufacture = catchAsync(async (req, res) => {
  const manufacture =
    await weaverManufacturerService.createWeaverManufacture(
      req.body
    );

  res.status(httpStatus.CREATED).send(manufacture);
});

/**
 * Upload file / profile image
 */
const fileUpload = catchAsync(async (req, res) => {
  const manufacture =
    await weaverManufacturerService.fileUpload(
      req,
      req.params.id
    );

  res.status(httpStatus.OK).send(manufacture);
});

/**
 * Get all Weaver Manufacturers
 */
const queryWeaverManufacture = catchAsync(async (req, res) => {
  const filter = {
    ...req.query,
  };

  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };

  // Remove pagination fields from Mongo filter
  delete filter.sortBy;
  delete filter.limit;
  delete filter.page;

  const result =
    await weaverManufacturerService.queryWeaverManufacture(
      filter,
      options
    );

  res.status(httpStatus.OK).send(result);
});

/**
 * Get Weaver Manufacturer by ID
 */
const getWeaverManufactureById = catchAsync(async (req, res) => {
  const manufacture =
    await weaverManufacturerService.getWeaverManufactureById(
      req.params.id
    );

  res.status(httpStatus.OK).send(manufacture);
});

/**
 * Get Weaver Manufacturer by email
 */
const getWeaverManufactureByEmail = catchAsync(async (req, res) => {
  const manufacture =
    await weaverManufacturerService.getWeaverManufactureByEmail(
      req.params.email
    );

  res.status(httpStatus.OK).send(manufacture);
});

/**
 * Get Weaver Manufacturers by referral email
 */
const getWeaverManufactureByRefEmail = catchAsync(
  async (req, res) => {
    const {
      refByEmail,
      searchKeywords = '',
    } = req.query;

    const options = {
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      page: req.query.page,
    };

    const result =
      await weaverManufacturerService.getWeaverManufactureByRefEmail(
        refByEmail,
        searchKeywords,
        options
      );

    res.status(httpStatus.OK).send(result);
  }
);

/**
 * Update Weaver Manufacturer
 */
const updateWeaverManufactureById = catchAsync(
  async (req, res) => {
    const manufacture =
      await weaverManufacturerService.updateWeaverManufactureById(
        req.params.email,
        req.body
      );

    res.status(httpStatus.OK).send(manufacture);
  }
);

/**
 * Delete Weaver Manufacturer by ID
 */
const deleteWeaverManufactureById = catchAsync(
  async (req, res) => {
    const manufacture =
      await weaverManufacturerService.deleteWeaverManufactureById(
        req.params.id
      );

    res.status(httpStatus.OK).send({
      message: 'Weaver Manufacturer deleted successfully',
      data: manufacture,
    });
  }
);

/**
 * Delete Weaver Manufacturer by email
 */
const deleteWeaverManufactureByEmail = catchAsync(
  async (req, res) => {
    const manufacture =
      await weaverManufacturerService.deleteWeaverManufactureByEmail(
        req.params.email
      );

    res.status(httpStatus.OK).send({
      message: 'Weaver Manufacturer deleted successfully',
      data: manufacture,
    });
  }
);

/**
 * Update visibility settings
 */
const updateVisibilitySettings = catchAsync(
  async (req, res) => {
    const manufacture =
      await weaverManufacturerService.updateVisibilitySettings(
        req.params.id,
        req.body
      );

    res.status(httpStatus.OK).send(manufacture);
  }
);

/**
 * Get visible/public profile
 */
const getVisibleProfile = catchAsync(async (req, res) => {
  const profile =
    await weaverManufacturerService.getVisibleProfile(
      req.params.id
    );

  res.status(httpStatus.OK).send(profile);
});

module.exports = {
  createWeaverManufacture,
  fileUpload,
  queryWeaverManufacture,
  getWeaverManufactureById,
  getWeaverManufactureByEmail,
  getWeaverManufactureByRefEmail,
  updateWeaverManufactureById,
  deleteWeaverManufactureById,
  deleteWeaverManufactureByEmail,
  updateVisibilitySettings,
  getVisibleProfile,
};