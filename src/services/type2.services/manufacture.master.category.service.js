const httpStatus = require('http-status');
const { ManufactureMasterCategory } = require('../../models');
const ApiError = require('../../utils/ApiError');

const createCategory = async (reqBody) => {
  // ✅ BULK INSERT
  if (Array.isArray(reqBody)) {
    if (reqBody.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category array cannot be empty');
    }

    // ✅ Remove duplicates from payload
    const uniqueData = [];
    const seen = new Set();

    reqBody.forEach((item) => {
      const key = `${item.manufacturerEmail}-${item.name?.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    });

    try {
      const created = await ManufactureMasterCategory.insertMany(uniqueData, {
        ordered: false, // 🔥 skip duplicates
      });

      return {
        success: true,
        message: 'Categories created successfully',
        count: created.length,
        data: created,
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: true,
          message: 'Categories inserted (duplicates skipped)',
        };
      }
      throw error;
    }
  }

  // ✅ SINGLE INSERT
  try {
    const created = await ManufactureMasterCategory.create(reqBody);

    return {
      success: true,
      message: 'Category created successfully',
      data: created,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Category already exists for this manufacturer'
      );
    }
    throw error;
  }
};

const queryCategories = async (filter, options) => {
  return ManufactureMasterCategory.paginate(filter, options);
};

const getCategoryById = async (id) => {
  return ManufactureMasterCategory.findById(id);
};

const updateCategoryById = async (id, updateBody) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);

  try {
    await category.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Category already exists for this manufacturer'
      );
    }
    throw error;
  }

  return category;
};

const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  await category.deleteOne();
  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};