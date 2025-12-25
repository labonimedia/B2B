const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { ManufactureMasterSubCategory } = require("../../models");

// /**
//  * Create Subcategory
//  */
// const createSubcategory = async (reqBody) => {
//   return ManufactureMasterSubCategory.create(reqBody);
// };
/**
 * Create Subcategory (Single or Bulk)
 */
const createSubcategory = async (reqBody) => {
  // CASE 1: Bulk Insert (Array)
  if (Array.isArray(reqBody)) {
    if (reqBody.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Subcategory array cannot be empty");
    }

    // Insert multiple subcategories
    const created = await ManufactureMasterSubCategory.insertMany(reqBody, {
      ordered: false, // continues even if some fail
    });

    return {
      success: true,
      message: "Subcategories created successfully",
      count: created.length,
      data: created,
    };
  }

  // CASE 2: Single Subcategory Create
  const created = await ManufactureMasterSubCategory.create(reqBody);

  return {
    success: true,
    message: "Subcategory created successfully",
    data: created,
  };
};

/**
 * Query Subcategories (with pagination)
 */
const querySubcategories = async (filter, options) => {
  const subcategories = await ManufactureMasterSubCategory.paginate(filter, options);
  return subcategories;
};

/**
 * Get Subcategory by ID
 */
const getSubcategoryById = async (id) => {
  return ManufactureMasterSubCategory.findById(id).populate("categoryId");
};

/**
 * Update Subcategory by ID
 */
const updateSubcategoryById = async (id, updateBody) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subcategory not found");
  }

  Object.assign(subcategory, updateBody);
  await subcategory.save();
  return subcategory;
};

/**
 * Delete Subcategory by ID
 */
const deleteSubcategoryById = async (id) => {
  const subcategory = await getSubcategoryById(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subcategory not found");
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
