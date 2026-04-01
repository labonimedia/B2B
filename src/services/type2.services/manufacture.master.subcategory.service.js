const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufactureMasterSubCategory } = require('../../models');

// const createSubcategory = async (reqBody) => {
//   // ✅ BULK INSERT
//   if (Array.isArray(reqBody)) {
//     if (reqBody.length === 0) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Subcategory list cannot be empty');
//     }

//     // ✅ Step 1: Remove duplicates from payload
//     const uniqueData = [];
//     const seen = new Set();

//     reqBody.forEach((item) => {
//       const key = `${item.categoryId}-${item.subcategoryName?.toLowerCase()}`;
//       if (!seen.has(key)) {
//         seen.add(key);
//         uniqueData.push(item);
//       }
//     });

//     try {
//       // ✅ Step 2: Insert safely (skip duplicates)
//       const created = await ManufactureMasterSubCategory.insertMany(uniqueData, {
//         ordered: false, // 🔥 VERY IMPORTANT
//       });

//       return {
//         success: true,
//         message: 'Subcategories created successfully',
//         count: created.length,
//         data: created,
//       };
//     } catch (error) {
//       // ✅ Handle duplicate errors gracefully
//       if (error.code === 11000) {
//         return {
//           success: true,
//           message: 'Subcategories inserted (duplicates skipped)',
//         };
//       }
//       throw error;
//     }
//   }

//   // ✅ SINGLE INSERT
//   try {
//     const created = await ManufactureMasterSubCategory.create(reqBody);

//     return {
//       success: true,
//       message: 'Subcategory created successfully',
//       data: created,
//     };
//   } catch (error) {
//     if (error.code === 11000) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Subcategory already exists in this category');
//     }
//     throw error;
//   }
// };

const createSubcategory = async (reqBody) => {
  if (Array.isArray(reqBody)) {
    if (!reqBody.length) {
      throw new ApiError(400, 'Subcategory list cannot be empty');
    }

    const uniqueData = [];
    const seen = new Set();

    reqBody.forEach((item) => {
      const key = `${item.categoryId}-${item.subcategoryName?.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    });

    try {
      const created = await ManufactureMasterSubCategory.insertMany(uniqueData, {
        ordered: false,
      });

      return {
        success: true,
        message: 'Subcategories processed',
        count: created.length,
        data: created,
      };
    } catch (error) {
      if (error.code === 11000) {
        return { success: true, message: 'Duplicates skipped' };
      }
      throw error;
    }
  }

  try {
    const created = await ManufactureMasterSubCategory.create(reqBody);
    return { success: true, data: created };
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, 'Subcategory already exists');
    }
    throw error;
  }
};

const querySubcategories = async (filter, options) => {
  const subcategories = await ManufactureMasterSubCategory.paginate(filter, options);
  return subcategories;
};

const getSubcategoryById = async (id) => {
  return ManufactureMasterSubCategory.findById(id).populate('categoryId');
};

const updateSubcategoryById = async (id, updateBody) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
  }
  Object.assign(subcategory, updateBody);
  await subcategory.save();
  return subcategory;
};

const deleteSubcategoryById = async (id) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
  }

  await subcategory.remove();
  return subcategory;
};

module.exports = {
  createSubcategory,
  querySubcategories,
  getSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
};
