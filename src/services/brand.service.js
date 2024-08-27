const httpStatus = require('http-status');
const { Brand, Manufacture } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Brand
 * @param {Object} reqBody
 * @returns {Promise<Brand>}
 */
const createBrand = async (reqBody) => {
  return Brand.create(reqBody);
};

/**
 * Query for Brand
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBrand = async (filter, options) => {
  const Brands = await Brand.paginate(filter, options);
  return Brands;
};

/**
 * Get Brand by id
 * @param {ObjectId} id
 * @returns {Promise<Brand>}
 */
const getBrandById = async (id) => {
  return Brand.findById(id);
};

/**
 * Update Brand by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Brand>}
 */
const updateBrandById = async (id, updateBody) => {
  const user = await getBrandById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Brand>}
 */
const deleteBrandById = async (id) => {
  const user = await getBrandById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  await user.remove();
  return user;
};

const searchBrandAndOwnerDetails = async (brandName) => {
  // Search for brands by brandName
  const brands = await Brand.find({ brandName: { $regex: brandName, $options: 'i' } });

  if (brands.length === 0) {
    return { brands: [], owners: [] }; // No brands found
  }

  // Extract brandOwner values
  const brandOwners = brands.map(brand => brand.brandOwner);

  // Fetch details of the manufacturers who own these brands
  const ownersDetails = await Manufacture.find({
    email: { $in: brandOwners }
  });

  return { brands, ownersDetails };
};

module.exports = {
  createBrand,
  queryBrand,
  getBrandById,
  updateBrandById,
  deleteBrandById,
  searchBrandAndOwnerDetails
};
