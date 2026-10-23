const httpStatus = require('http-status');

const { WeaverItemTypeMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Type Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemTypeMaster>}
 */
const createWeaverItemTypeMaster = async (reqBody) => {
  return WeaverItemTypeMaster.create(reqBody);
};

/**
 * Query Weaver Item Type Masters
 *
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemTypeMaster = async (filter, options) => {
  const itemTypes = await WeaverItemTypeMaster.paginate(filter, options);

  return itemTypes;
};

/**
 * Get Weaver Item Type Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemTypeMaster>}
 */
const getWeaverItemTypeMasterById = async (id) => {
  const itemType = await WeaverItemTypeMaster.findById(id);

  if (!itemType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Type Master not found');
  }

  return itemType;
};

/**
 * Search Weaver Item Type Masters
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
const searchWeaverItemTypeMaster = async (searchBody) => {
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

  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverItemTypeMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Type Masters
 *
 * CSV format:
 *
 * name,default,remark,code
 *
 * @param {Array<Object>} itemTypeArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (itemTypeArray = [], user) => {
  if (!Array.isArray(itemTypeArray) || itemTypeArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing or empty CSV data');
  }

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  /**
   * Get Weaver information
   * from authenticated user
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

  itemTypeArray.forEach((itemType, index) => {
    const rowNumber = index + 2;

    const name = String(itemType.name || itemType.Name || '').trim();

    const defaultValue = String(itemType.default || itemType.Default || '').trim();

    const remark = String(itemType.remark || itemType.Remark || '').trim();

    const code = String(itemType.code || itemType.Code || '').trim();

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

      totalRecords: itemTypeArray.length,

      successCount: 0,

      failedCount: errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate item type names
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
        error: 'Duplicate item type name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing item types
   * for this Weaver
   */
  const existingItemTypes = await WeaverItemTypeMaster.find({
    weaverId,
  }).select('name');

  const existingNames = new Set(existingItemTypes.map((itemType) => itemType.name.trim().toLowerCase()));

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
        error: 'Item Type already exists',
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
      insertedRecords = await WeaverItemTypeMaster.insertMany(recordsToInsert, {
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

    totalRecords: itemTypeArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Type Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemTypeMaster>}
 */
const updateWeaverItemTypeMasterById = async (id, updateBody) => {
  const itemType = await getWeaverItemTypeMasterById(id);

  Object.assign(itemType, updateBody);

  await itemType.save();

  return itemType;
};

/**
 * Delete Weaver Item Type Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemTypeMaster>}
 */
const deleteWeaverItemTypeMasterById = async (id) => {
  const itemType = await getWeaverItemTypeMasterById(id);

  await itemType.deleteOne();

  return itemType;
};

module.exports = {
  createWeaverItemTypeMaster,
  queryWeaverItemTypeMaster,
  getWeaverItemTypeMasterById,
  searchWeaverItemTypeMaster,
  bulkUpload,
  updateWeaverItemTypeMasterById,
  deleteWeaverItemTypeMasterById,
};
