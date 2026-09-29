const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const { weaverBrandService } = require('../../services');
const { deleteFile } = require('../../utils/upload');

/**
 * Create Brand
 */
const createBrand = catchAsync(async (req, res) => {
  if (
    !req.body.brandLogo ||
    !Array.isArray(req.body.brandLogo) ||
    req.body.brandLogo.length === 0
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No brand logo provided'
    );
  }

  req.body.brandLogo = req.body.brandLogo[0];

  const brand = await weaverBrandService.createBrand(req.body);

  res.status(httpStatus.CREATED).send(brand);
});

/**
 * Query Brands
 */
const queryBrand = catchAsync(async (req, res) => {
  const { brandName, brandOwner, visibility, isActive } = req.query;

  const filter = {};

  if (brandName) {
    filter.brandName = {
      $regex: brandName,
      $options: 'i',
    };
  }

  if (brandOwner) {
    filter.brandOwner = brandOwner.toLowerCase();
  }

  if (visibility !== undefined) {
    filter.visibility = visibility === 'true';
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const options = pick(req.query, [
    'sortBy',
    'limit',
    'page',
  ]);

  const result = await weaverBrandService.queryBrand(
    filter,
    options
  );

  res.send(result);
});

/**
 * Get Brand by ID
 */
const getBrandById = catchAsync(async (req, res) => {
  const brand = await weaverBrandService.getBrandById(
    req.params.id
  );

  if (!brand) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Brand not found'
    );
  }

  res.send(brand);
});

/**
 * Get Brands by Owner Email
 */
const getBrandByEmail = catchAsync(async (req, res) => {
  const brands = await weaverBrandService.getBrandByEmail(
    req.params.email
  );

  if (!brands || brands.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Brand not found'
    );
  }

  res.send(brands);
});

/**
 * Get Brands by Owner Email and Visibility
 */
const getBrandByEmailAndVisibility = catchAsync(
  async (req, res) => {
    const { email, visibility } = req.params;

    const visibilityValue =
      visibility === 'true';

    const brands =
      await weaverBrandService.getBrandByEmailAndVisibility(
        email,
        visibilityValue
      );

    if (!brands || brands.length === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Brand not found'
      );
    }

    res.send(brands);
  }
);

/**
 * Update Brand
 */
const updateBrandById = catchAsync(async (req, res) => {
  const brand =
    await weaverBrandService.getBrandById(req.params.id);

  if (!brand) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Brand not found'
    );
  }

  /**
   * If new logo uploaded,
   * delete old logo first.
   */
  if (
    req.body.brandLogo &&
    Array.isArray(req.body.brandLogo) &&
    req.body.brandLogo.length > 0
  ) {
    if (brand.brandLogo) {
      await deleteFile(brand.brandLogo);
    }

    req.body.brandLogo = req.body.brandLogo[0];
  }

  const updatedBrand =
    await weaverBrandService.updateBrandById(
      req.params.id,
      req.body
    );

  res.send(updatedBrand);
});

/**
 * Update only Brand Visibility
 */
const updateVisibility = catchAsync(async (req, res) => {
  const { visibility } = req.body;

  if (typeof visibility !== 'boolean') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'visibility must be a boolean'
    );
  }

  const brand =
    await weaverBrandService.updateBrandById(
      req.params.id,
      {
        visibility,
      }
    );

  res.send(brand);
});

/**
 * Delete Brand
 */
const deleteBrandById = catchAsync(async (req, res) => {
  const brand =
    await weaverBrandService.deleteBrandById(
      req.params.id
    );

  /**
   * Delete logo from storage
   */
  if (brand.brandLogo) {
    await deleteFile(brand.brandLogo);
  }

  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Search Brand + Owner Details
 */
const searchBrandAndOwnerDetails = catchAsync(
  async (req, res) => {
    const {
      brandName,
      requestByEmail,
    } = req.body;

    if (!brandName) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Brand name is required'
      );
    }

    const data =
      await weaverBrandService.searchBrandAndOwnerDetails(
        brandName,
        requestByEmail
      );

    res.status(httpStatus.OK).send(data);
  }
);

/**
 * Search Brands Connected to Wholesalers
 */
const getBrandsAndWholesalers = catchAsync(
  async (req, res) => {
    const {
      brandName,
      requestByEmail,
    } = req.body;

    if (!brandName) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Brand name is required'
      );
    }

    const data =
      await weaverBrandService.getBrandsAndWholesalers(
        brandName,
        requestByEmail
      );

    res.status(httpStatus.OK).send(data);
  }
);

module.exports = {
  createBrand,
  queryBrand,
  getBrandById,
  getBrandByEmail,
  getBrandByEmailAndVisibility,
  updateBrandById,
  updateVisibility,
  deleteBrandById,
  searchBrandAndOwnerDetails,
  getBrandsAndWholesalers,
};