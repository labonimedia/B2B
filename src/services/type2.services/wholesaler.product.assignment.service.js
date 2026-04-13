const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { WholesalerProductAssignment, ProductType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');


/**
 * ASSIGN PRODUCTS TO MULTIPLE WHOLESALERS
 */
const assignProductsToMultipleWholesalers = async (manufacturerEmail, wholesalerEmails, productIds) => {
  // ✅ Validate products belong to manufacturer
  const products = await ProductType2.find({
    _id: { $in: productIds },
    productBy: manufacturerEmail,
  });

  if (products.length !== productIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid products');
  }

  // ✅ Create bulk operations
  const bulkOps = [];

  wholesalerEmails.forEach((wholesalerEmail) => {
    productIds.forEach((productId) => {
      bulkOps.push({
        updateOne: {
          filter: { productId, wholesalerEmail },
          update: {
            productId,
            wholesalerEmail,
            manufacturerEmail,
            assignedBy: manufacturerEmail,
            isActive: true,
          },
          upsert: true,
        },
      });
    });
  });

  await WholesalerProductAssignment.bulkWrite(bulkOps);

  return {
    message: 'Products assigned to multiple wholesalers successfully',
    totalAssignments: bulkOps.length,
  };
};

/**
 * ASSIGN PRODUCTS (BULK)
 */
const assignProducts = async (manufacturerEmail, wholesalerEmail, productIds) => {
  // ✅ Validate manufacturer owns products
  const products = await ProductType2.find({
    _id: { $in: productIds },
    productBy: manufacturerEmail,
  });

  if (products.length !== productIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid products');
  }

  // ✅ Bulk insert (ignore duplicates)
  const bulkOps = productIds.map((productId) => ({
    updateOne: {
      filter: { productId, wholesalerEmail },
      update: {
        productId,
        wholesalerEmail,
        manufacturerEmail,
        assignedBy: manufacturerEmail,
        isActive: true,
      },
      upsert: true,
    },
  }));

  await WholesalerProductAssignment.bulkWrite(bulkOps);

  return { message: 'Products assigned successfully' };
};

/**
 * GET ASSIGNMENTS
 */
const queryAssignments = async (filter, options) => {
  return WholesalerProductAssignment.paginate(filter, options);
};

/**
 * GET BY ID
 */
const getAssignmentById = async (id) => {
  const doc = await WholesalerProductAssignment.findById(id);
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  return doc;
};

/**
 * REMOVE SINGLE PRODUCT
 */
// const removeAssignment = async (productId, wholesalerEmail) => {
//   const doc = await WholesalerProductAssignment.findOneAndDelete({
//     productId,
//     wholesalerEmail,
//   });

//   if (!doc) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
//   }

//   return { message: 'Product unassigned successfully' };
// };

const removeAssignment = async (productId, productIds, wholesalerEmail) => {
  let idsToRemove = [];

  // 🔥 Handle single
  if (productId) {
    idsToRemove.push(productId);
  }

  // 🔥 Handle multiple
  if (productIds && Array.isArray(productIds)) {
    idsToRemove = [...idsToRemove, ...productIds];
  }

  // ✅ Convert to ObjectId (important)
  idsToRemove = idsToRemove.map((id) => mongoose.Types.ObjectId(id));

  // 🔥 Delete many
  const result = await WholesalerProductAssignment.deleteMany({
    wholesalerEmail,
    productId: { $in: idsToRemove },
  });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No assignments found');
  }

  return {
    message: 'Product(s) unassigned successfully',
    deletedCount: result.deletedCount,
  };
};

/**
 * TOGGLE ACTIVE (optional)
 */
const toggleAssignmentStatus = async (id, isActive) => {
  const doc = await WholesalerProductAssignment.findById(id);

  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  doc.isActive = isActive;
  await doc.save();

  return doc;
};

module.exports = {
  assignProducts,
  queryAssignments,
  getAssignmentById,
  removeAssignment,
  toggleAssignmentStatus,
  assignProductsToMultipleWholesalers,
};
