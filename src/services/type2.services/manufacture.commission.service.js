const httpStatus = require('http-status');
const { ManufactureCommission, ChannelPartner } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create Commission Category
 */
const createCommissionCategory = async (reqBody) => {
  return ManufactureCommission.create(reqBody);
};

/**
 * Query Commission Category
 */
const queryCommissionCategory = async (filter, options) => {
  return ManufactureCommission.paginate(filter, options);
};

/**
 * Get by ID
 */
const getCommissionCategoryById = async (id) => {
  return ManufactureCommission.findById(id);
};

/**
 * Update Commission Category
 */
const updateCommissionCategoryById = async (id, updateBody) => {
  const category = await getCommissionCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  Object.assign(category, updateBody);
  await category.save();

  // 🔥 Update Channel Partner commissionGiven
  await ChannelPartner.updateMany(
    { 'commissionGiven.id': id },
    {
      $set: {
        'commissionGiven.$[elem].category': updateBody.category,
        'commissionGiven.$[elem].productCommission': updateBody.productCommission,
        'commissionGiven.$[elem].shippingCommission': updateBody.shippingCommission,
      },
    },
    {
      arrayFilters: [{ 'elem.id': id }],
    }
  );

  return category;
};

/**
 * Delete Commission Category
 */
const deleteCommissionCategoryById = async (id) => {
  const category = await getCommissionCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  // 🔥 Remove from ChannelPartner
  await ChannelPartner.updateMany({ 'commissionGiven.id': id }, { $pull: { commissionGiven: { id } } });

  await category.remove();

  return category;
};

module.exports = {
  createCommissionCategory,
  queryCommissionCategory,
  getCommissionCategoryById,
  updateCommissionCategoryById,
  deleteCommissionCategoryById,
};
