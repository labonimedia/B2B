const httpStatus = require('http-status');

const {
  WeaverBrand,
  Request,
  User,
  WeaverManufacture,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Brand
 *
 * @param {Object} reqBody
 * @returns {Promise<Object>}
 */
const createBrand = async (reqBody) => {
  const { brandName, brandOwner } = reqBody;

  // Check duplicate brand for same owner
  const existingBrand = await WeaverBrand.findOne({
    brandName: brandName.trim(),
    brandOwner: brandOwner.trim().toLowerCase(),
  });

  if (existingBrand) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Brand already exists for this owner'
    );
  }

  return WeaverBrand.create(reqBody);
};

/**
 * Query Brands
 *
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const queryBrand = async (filter, options) => {
  return WeaverBrand.paginate(filter, options);
};

/**
 * Get Brand by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<Object|null>}
 */
const getBrandById = async (id) => {
  return WeaverBrand.findById(id);
};

/**
 * Get Brands by Owner Email
 *
 * @param {String} email
 * @returns {Promise<Array>}
 */
const getBrandByEmail = async (email) => {
  return WeaverBrand.find({
    brandOwner: email.toLowerCase(),
  }).sort({ createdAt: -1 });
};

/**
 * Get Brands by Owner Email and Visibility
 *
 * @param {String} email
 * @param {Boolean} visibility
 * @returns {Promise<Array>}
 */
const getBrandByEmailAndVisibility = async (email, visibility) => {
  return WeaverBrand.find({
    brandOwner: email.toLowerCase(),
    visibility,
  }).sort({ createdAt: -1 });
};

/**
 * Update Brand by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 */
const updateBrandById = async (id, updateBody) => {
  const brand = await getBrandById(id);

  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }

  // Check duplicate brand when updating name/owner
  if (updateBody.brandName || updateBody.brandOwner) {
    const brandName = updateBody.brandName || brand.brandName;
    const brandOwner = updateBody.brandOwner || brand.brandOwner;

    const duplicateBrand = await WeaverBrand.findOne({
      _id: { $ne: id },
      brandName: brandName.trim(),
      brandOwner: brandOwner.trim().toLowerCase(),
    });

    if (duplicateBrand) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Brand already exists for this owner'
      );
    }
  }

  Object.assign(brand, updateBody);

  await brand.save();

  return brand;
};

/**
 * Delete Brand by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<Object>}
 */
const deleteBrandById = async (id) => {
  const brand = await getBrandById(id);

  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }

  await WeaverBrand.deleteOne({ _id: id });

  return brand;
};

/**
 * Search Brands with Manufacturer Details
 *
 * @param {String} brandName
 * @param {String} requestByEmail
 * @returns {Promise<Array>}
 */
const searchBrandAndOwnerDetails = async (
  brandName,
  requestByEmail
) => {
  const brands = await WeaverBrand.find({
    brandName: {
      $regex: brandName,
      $options: 'i',
    },
    isActive: true,
  }).lean();

  if (!brands.length) {
    return [];
  }

  const brandOwnerEmails = [
    ...new Set(brands.map((brand) => brand.brandOwner)),
  ];

  // Weaver manufacturer details
  const manufacturers = await WeaverManufacture.find({
    email: { $in: brandOwnerEmails },
  }).lean();

  // Request details
  const requestFilter = {
    email: { $in: brandOwnerEmails },
  };

  if (requestByEmail) {
    requestFilter.requestByEmail = requestByEmail;
  }

  const requests = await Request.find(requestFilter)
    .sort({ createdAt: -1 })
    .lean();

  const manufacturerMap = new Map(
    manufacturers.map((manufacturer) => [
      manufacturer.email,
      manufacturer,
    ])
  );

  const requestMap = new Map();

  requests.forEach((request) => {
    if (!requestMap.has(request.email)) {
      requestMap.set(request.email, request);
    }
  });

  return brands.map((brand) => ({
    ...brand,

    ownerDetails:
      manufacturerMap.get(brand.brandOwner) || null,

    requestDetails:
      requestMap.get(brand.brandOwner) || null,
  }));
};

/**
 * Get Brands and Connected Wholesalers
 *
 * Flow:
 *
 * Brand
 *   ↓
 * Brand Owner / Weaver Manufacturer
 *   ↓
 * User.refByEmail
 *   ↓
 * Wholesaler
 *
 * @param {String} brandNamePattern
 * @param {String} requestByEmail
 * @returns {Promise<Array>}
 */
const getBrandsAndWholesalers = async (
  brandNamePattern,
  requestByEmail
) => {
  const brands = await WeaverBrand.find({
    brandName: {
      $regex: brandNamePattern,
      $options: 'i',
    },
    isActive: true,
  }).lean();

  if (!brands.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No brands found matching the criteria'
    );
  }

  const brandOwnerEmails = [
    ...new Set(brands.map((brand) => brand.brandOwner)),
  ];

  /**
   * Users connected with brand owners
   */
  const users = await User.find({
    refByEmail: {
      $in: brandOwnerEmails,
    },
    role: 'wholesaler',
    userCategory: 'orderwise',
  }).lean();

  if (!users.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No wholesalers found for the specified brands'
    );
  }

  const wholesalerEmails = [
    ...new Set(users.map((user) => user.email)),
  ];

  /**
   * Wholesaler profile
   */
  const wholesalers = await Wholesaler.find({
    email: {
      $in: wholesalerEmails,
    },
  }).lean();

  const wholesalerMap = new Map(
    wholesalers.map((wholesaler) => [
      wholesaler.email,
      wholesaler,
    ])
  );

  /**
   * Request details
   */
  const requestFilter = {
    email: {
      $in: wholesalerEmails,
    },
  };

  if (requestByEmail) {
    requestFilter.requestByEmail = requestByEmail;
  }

  const requests = await Request.find(requestFilter)
    .sort({ createdAt: -1 })
    .lean();

  /**
   * Keep latest request for each wholesaler
   *
   * Accepted requests are excluded because
   * your existing business logic requires this.
   */
  const requestMap = new Map();

  requests.forEach((request) => {
    if (
      request.status !== 'accepted' &&
      !requestMap.has(request.email)
    ) {
      requestMap.set(request.email, request);
    }
  });

  /**
   * Combine everything
   */
  return brands.map((brand) => {
    const connectedUsers = users.filter((user) =>
      Array.isArray(user.refByEmail) &&
      user.refByEmail.includes(brand.brandOwner)
    );

    const associatedWholesalers = connectedUsers
      .map((user) => wholesalerMap.get(user.email))
      .filter(Boolean);

    const requestDetails = associatedWholesalers
      .map((wholesaler) => requestMap.get(wholesaler.email))
      .filter(Boolean);

    return {
      brand,

      wholesalers: associatedWholesalers,

      requestDetails,
    };
  });
};

module.exports = {
  createBrand,
  queryBrand,
  getBrandById,
  getBrandByEmail,
  getBrandByEmailAndVisibility,
  updateBrandById,
  deleteBrandById,
  searchBrandAndOwnerDetails,
  getBrandsAndWholesalers,
};