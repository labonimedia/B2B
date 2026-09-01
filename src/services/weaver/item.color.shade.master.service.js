const httpStatus = require('http-status');

const { WeaverItemColorShadeMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Color Shade Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemColorShadeMaster>}
 */
const createWeaverItemColorShadeMaster = async (reqBody) => {
  return WeaverItemColorShadeMaster.create(reqBody);
};

/**
 * Query Weaver Item Color Shade Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemColorShadeMaster = async (filter, options) => {
  const colorShades = await WeaverItemColorShadeMaster.paginate(filter, options);

  return colorShades;
};

/**
 * Get Weaver Item Color Shade Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemColorShadeMaster>}
 */
const getWeaverItemColorShadeMasterById = async (id) => {
  const colorShade = await WeaverItemColorShadeMaster.findById(id);

  if (!colorShade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Color Shade Master not found');
  }

  return colorShade;
};

/**
 * Search Weaver Item Color Shade Masters
 *
 * Searches:
 * - name
 * - remark
 * - code
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverItemColorShadeMaster = async (searchBody) => {
  const { weaverId, keyword = '', sortBy, limit, page } = searchBody;

  if (!weaverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'weaverId is required');
  }

  const filter = {
    weaverId,
  };

  const searchKeyword = String(keyword).trim();

  /**
   * Search by keyword
   */
  if (searchKeyword) {
    const escapedKeyword = searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const searchRegex = new RegExp(escapedKeyword, 'i');

    filter.$or = [
      {
        name: {
          $regex: searchRegex,
        },
      },
      {
        remark: {
          $regex: searchRegex,
        },
      },
      {
        code: {
          $regex: searchRegex,
        },
      },
      {
        weaverEmail: {
          $regex: searchRegex,
        },
      },
    ];
  }

  /**
   * Pagination / sorting options
   */
  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverItemColorShadeMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Color Shade Masters
 *
 * CSV format:
 *
 * name,remark,code
 *
 * @param {Array<Object>} colorShadeArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (colorShadeArray = [], user) => {
  if (!Array.isArray(colorShadeArray) || colorShadeArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing or empty CSV data');
  }

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  /**
   * Get Weaver information
   * from authenticated user.
   */
  const weaverId = user.weaverId || user._id;

  const weaverEmail = user.email;

  if (!weaverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Weaver ID not found');
  }

  if (!weaverEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Weaver email not found');
  }

  /**
   * Prepare valid records
   */
  const validRecords = [];
  const errors = [];

  colorShadeArray.forEach((colorShade, index) => {
    const rowNumber = index + 2;

    const name = String(colorShade.name || colorShade.Name || '').trim();

    const remark = String(colorShade.remark || colorShade.Remark || '').trim();

    const code = String(colorShade.code || colorShade.Code || '').trim();

    /**
     * Name validation
     */
    if (!name) {
      errors.push({
        row: rowNumber,
        name: '',
        error: 'Name is required',
      });

      return;
    }

    validRecords.push({
      name,
      remark,
      code,
      weaverId,
      weaverEmail,
    });
  });

  /**
   * No valid records
   */
  if (!validRecords.length) {
    return {
      message: 'No valid records found',

      totalRecords: colorShadeArray.length,

      successCount: 0,

      failedCount: errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate color shade names
   * from uploaded CSV.
   *
   * Case-insensitive.
   */
  const uniqueRecords = [];

  const duplicateNames = new Set();

  validRecords.forEach((record, index) => {
    const nameKey = record.name.trim().toLowerCase();

    if (duplicateNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Duplicate color shade name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing color shades
   * for this Weaver.
   */
  const existingColorShades = await WeaverItemColorShadeMaster.find({
    weaverId,
  }).select('name');

  const existingNames = new Set(existingColorShades.map((colorShade) => colorShade.name.trim().toLowerCase()));

  /**
   * Remove existing records
   */
  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    const nameKey = record.name.trim().toLowerCase();

    if (existingNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Item Color Shade already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });

  /**
   * Insert valid records
   */
  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords = await WeaverItemColorShadeMaster.insertMany(recordsToInsert, {
        ordered: false,
      });
    } catch (error) {
      if (error.writeErrors && error.writeErrors.length) {
        error.writeErrors.forEach((writeError) => {
          errors.push({
            row: writeError.index + 2,

            error: writeError.errmsg || 'Failed to insert record',
          });
        });

        insertedRecords = error.insertedDocs || [];
      } else {
        throw error;
      }
    }
  }

  return {
    message: 'Bulk upload completed successfully',

    totalRecords: colorShadeArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Color Shade Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemColorShadeMaster>}
 */
const updateWeaverItemColorShadeMasterById = async (id, updateBody) => {
  const colorShade = await getWeaverItemColorShadeMasterById(id);

  Object.assign(colorShade, updateBody);

  await colorShade.save();

  return colorShade;
};

/**
 * Delete Weaver Item Color Shade Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemColorShadeMaster>}
 */
const deleteWeaverItemColorShadeMasterById = async (id) => {
  const colorShade = await getWeaverItemColorShadeMasterById(id);

  await colorShade.deleteOne();

  return colorShade;
};

module.exports = {
  createWeaverItemColorShadeMaster,
  queryWeaverItemColorShadeMaster,
  getWeaverItemColorShadeMasterById,
  searchWeaverItemColorShadeMaster,
  bulkUpload,
  updateWeaverItemColorShadeMasterById,
  deleteWeaverItemColorShadeMasterById,
};
