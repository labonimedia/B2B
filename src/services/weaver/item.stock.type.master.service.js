const httpStatus = require('http-status');

const { WeaverItemStockTypeMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Stock Type Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemStockTypeMaster>}
 */
const createWeaverItemStockTypeMaster = async (reqBody) => {
  return WeaverItemStockTypeMaster.create(reqBody);
};

/**
 * Query Weaver Item Stock Type Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemStockTypeMaster = async (filter, options) => {
  const stockTypes = await WeaverItemStockTypeMaster.paginate(filter, options);

  return stockTypes;
};

/**
 * Get Weaver Item Stock Type Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemStockTypeMaster>}
 */
const getWeaverItemStockTypeMasterById = async (id) => {
  const stockType = await WeaverItemStockTypeMaster.findById(id);

  if (!stockType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Stock Type Master not found');
  }

  return stockType;
};

/**
 * Search Weaver Item Stock Type Masters
 *
 * Searches:
 * - name
 * - default
 * - remark
 * - code
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverItemStockTypeMaster = async (searchBody) => {
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
        default: {
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

  return WeaverItemStockTypeMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Stock Type Masters
 *
 * CSV format:
 *
 * name,default,remark,code
 *
 * @param {Array<Object>} stockTypeArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (stockTypeArray = [], user) => {
  if (!Array.isArray(stockTypeArray) || stockTypeArray.length === 0) {
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

  stockTypeArray.forEach((stockType, index) => {
    const rowNumber = index + 2;

    const name = String(stockType.name || stockType.Name || '').trim();

    const defaultValue = String(stockType.default || stockType.Default || '').trim();

    const remark = String(stockType.remark || stockType.Remark || '').trim();

    const code = String(stockType.code || stockType.Code || '').trim();

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
      default: defaultValue,
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

      totalRecords: stockTypeArray.length,

      successCount: 0,

      failedCount: errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate stock type names
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
        error: 'Duplicate stock type name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing stock types
   * for this Weaver.
   */
  const existingStockTypes = await WeaverItemStockTypeMaster.find({
    weaverId,
  }).select('name');

  const existingNames = new Set(existingStockTypes.map((stockType) => stockType.name.trim().toLowerCase()));

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
        error: 'Item Stock Type already exists',
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
      insertedRecords = await WeaverItemStockTypeMaster.insertMany(recordsToInsert, {
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

    totalRecords: stockTypeArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Stock Type Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemStockTypeMaster>}
 */
const updateWeaverItemStockTypeMasterById = async (id, updateBody) => {
  const stockType = await getWeaverItemStockTypeMasterById(id);

  Object.assign(stockType, updateBody);

  await stockType.save();

  return stockType;
};

/**
 * Delete Weaver Item Stock Type Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemStockTypeMaster>}
 */
const deleteWeaverItemStockTypeMasterById = async (id) => {
  const stockType = await getWeaverItemStockTypeMasterById(id);

  await stockType.deleteOne();

  return stockType;
};

module.exports = {
  createWeaverItemStockTypeMaster,
  queryWeaverItemStockTypeMaster,
  getWeaverItemStockTypeMasterById,
  searchWeaverItemStockTypeMaster,
  bulkUpload,
  updateWeaverItemStockTypeMasterById,
  deleteWeaverItemStockTypeMasterById,
};
