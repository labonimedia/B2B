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

const updateCommissionCategoryById = async (id, updateBody, manufacturerEmail) => {
  const category = await getCommissionCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  // 🔥 Only owner can update
  if (category.categoryBy !== manufacturerEmail) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  Object.assign(category, updateBody);
  await category.save();

  // 🔥 Update ONLY this manufacturer’s commission in CP
  await ChannelPartner.updateMany(
    {
      commissionGiven: {
        $elemMatch: {
          id,
          commissionGivenBy: manufacturerEmail,
        },
      },
    },
    {
      $set: {
        'commissionGiven.$[elem].category': updateBody.category,
        'commissionGiven.$[elem].productCommission': updateBody.productCommission,
        'commissionGiven.$[elem].shippingCommission': updateBody.shippingCommission,
      },
    },
    {
      arrayFilters: [
        {
          'elem.id': id,
          'elem.commissionGivenBy': manufacturerEmail,
        },
      ],
    }
  );

  return category;
};

const deleteCommissionCategoryById = async (id, manufacturerEmail) => {
  const category = await getCommissionCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  // 🔥 Only owner can delete
  if (category.categoryBy !== manufacturerEmail) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  // 🔥 Remove ONLY this manufacturer’s commission from CP
  await ChannelPartner.updateMany(
    {},
    {
      $pull: {
        commissionGiven: {
          id,
          commissionGivenBy: manufacturerEmail,
        },
      },
    }
  );

  await category.remove();

  return category;
};
const assignCommission = async ({ manufacturerEmail, channelPartnerEmail, categoryId }) => {
  // 1️⃣ Get category
  const category = await ManufactureCommission.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // 2️⃣ Get Channel Partner
  const cp = await ChannelPartner.findOne({ email: channelPartnerEmail });
  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  // 3️⃣ Check if manufacturer already assigned ANY category
  const existingIndex = cp.commissionGiven.findIndex((c) => c.commissionGivenBy === manufacturerEmail);

  if (existingIndex !== -1) {
    // 🔁 UPDATE EXISTING (REPLACE CATEGORY)
    cp.commissionGiven[existingIndex].id = category._id;
    cp.commissionGiven[existingIndex].category = category.category;
    cp.commissionGiven[existingIndex].productCommission = category.productCommission;
    cp.commissionGiven[existingIndex].shippingCommission = category.shippingCommission;

    await cp.save();

    return {
      message: 'Commission updated (category replaced)',
      data: cp,
    };
  }

  // ➕ CREATE NEW (FIRST TIME)
  cp.commissionGiven.push({
    commissionGivenBy: manufacturerEmail,
    id: category._id,
    category: category.category,
    productCommission: category.productCommission,
    shippingCommission: category.shippingCommission,
  });

  await cp.save();

  return {
    message: 'Commission assigned successfully',
    data: cp,
  };
};

/**
 * ✅ UPDATE ASSIGNED COMMISSION
 */
const updateAssignedCommission = async ({
  manufacturerEmail,
  channelPartnerEmail,
  categoryId,
  productCommission,
  shippingCommission,
}) => {
  const cp = await ChannelPartner.findOne({ email: channelPartnerEmail });
  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  const commission = cp.commissionGiven.find((c) => c.id === categoryId && c.commissionGivenBy === manufacturerEmail);

  if (!commission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission not found');
  }

  if (productCommission !== undefined) {
    commission.productCommission = productCommission;
  }

  if (shippingCommission !== undefined) {
    commission.shippingCommission = shippingCommission;
  }

  await cp.save();

  return cp;
};

/**
 * ✅ DELETE ASSIGNED COMMISSION
 */
const deleteAssignedCommission = async ({ manufacturerEmail, channelPartnerEmail, categoryId }) => {
  const cp = await ChannelPartner.findOne({ email: channelPartnerEmail });
  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  cp.commissionGiven = cp.commissionGiven.filter((c) => !(c.id === categoryId && c.commissionGivenBy === manufacturerEmail));

  await cp.save();

  return cp;
};

const checkCommission = async ({ manufacturerEmail, channelPartnerEmail }) => {
  if (!channelPartnerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'channelPartnerEmail is required');
  }
  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail is required');
  }
  // 1️⃣ Find CP
  const cp = await ChannelPartner.findOne({ email: channelPartnerEmail });

  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  // 2️⃣ Find commission for this manufacturer
  const commission = cp.commissionGiven.find((c) => c.commissionGivenBy === manufacturerEmail);

  // 3️⃣ Return result
  if (commission) {
    return {
      exists: true,
      commission,
    };
  }

  return {
    exists: false,
    commission: null,
  };
};

module.exports = {
  createCommissionCategory,
  queryCommissionCategory,
  getCommissionCategoryById,
  updateCommissionCategoryById,
  deleteCommissionCategoryById,
  assignCommission,
  updateAssignedCommission,
  deleteAssignedCommission,
  checkCommission,
};
