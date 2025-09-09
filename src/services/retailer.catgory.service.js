const httpStatus = require('http-status');
const { RetailerCategory, Retailer } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a RetailerCategory
 * @param {Object} reqBody
 * @returns {Promise<RetailerCategory>}
 */
const createRetailerCategory = async (reqBody) => {
  return RetailerCategory.create(reqBody);
};

/**
 * Query for RetailerCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRetailerCategory = async (filter, options) => {
  const rtailerCategorys = await RetailerCategory.paginate(filter, options);
  return rtailerCategorys;
};

/**
 * Get RetailerCategory by id
 * @param {ObjectId} id
 * @returns {Promise<RetailerCategory>}
 */
const getRetailerCategoryById = async (id) => {
  return RetailerCategory.findById(id);
};

// /**
//  * Update RetailerCategory by id
//  * @param {ObjectId} Id
//  * @param {Object} updateBody
//  * @returns {Promise<RetailerCategory>}
//  */
// const updateRetailerCategoryById = async (id, updateBody) => {
//   const user = await getRetailerCategoryById(id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Retailer Category not found');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };
const updateRetailerCategoryById = async (id, updateBody) => {
  const category = await getRetailerCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer Category not found');
  }

  Object.assign(category, updateBody);
  await category.save();

  // Update retailers who have this category
  await Retailer.updateMany(
    { 'discountGiven.id': id },
    {
      $set: {
        'discountGiven.$[elem].category': updateBody.category,
        'discountGiven.$[elem].productDiscount': updateBody.productDiscount,
        'discountGiven.$[elem].shippingDiscount': updateBody.shippingDiscount,
      },
    },
    {
      arrayFilters: [{ 'elem.id': id }],
    }
  );

  return category;
};
// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<RetailerCategory>}
//  */
// const deleteRetailerCategoryById = async (id) => {
//   const user = await getRetailerCategoryById(id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Retailer Category not found');
//   }
//   await user.remove();
//   return user;
// };
const deleteRetailerCategoryById = async (id) => {
  const category = await getRetailerCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer Category not found');
  }

  // Remove the category from Retailers' discountGiven array
  await Retailer.updateMany({ 'discountGiven.id': id }, { $pull: { discountGiven: { id } } });

  // Remove the category itself
  await category.remove();

  return category;
};
module.exports = {
  createRetailerCategory,
  queryRetailerCategory,
  getRetailerCategoryById,
  updateRetailerCategoryById,
  deleteRetailerCategoryById,
};
