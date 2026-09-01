const httpStatus = require('http-status');

const { WeaverItemSubGroupMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Sub Group Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemSubGroupMaster>}
 */
const createWeaverItemSubGroupMaster = async (reqBody) => {
  return WeaverItemSubGroupMaster.create(reqBody);
};

/**
 * Query Weaver Item Sub Group Masters
 *
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemSubGroupMaster = async (filter, options) => {
  const subGroups = await WeaverItemSubGroupMaster.paginate(filter, options);

  return subGroups;
};

/**
 * Get Weaver Item Sub Group Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemSubGroupMaster>}
 */
const getWeaverItemSubGroupMasterById = async (id) => {
  const subGroup = await WeaverItemSubGroupMaster.findById(id);

  if (!subGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Sub Group Master not found');
  }

  return subGroup;
};

/**
 * Search Weaver Item Sub Group Masters
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
const searchWeaverItemSubGroupMaster = async (searchBody) => {
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

  return WeaverItemSubGroupMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Sub Group Masters
 *
 * CSV format:
 *
 * name,default,remark,code
 *
 * @param {Array<Object>} subGroupArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (subGroupArray = [], user) => {
  if (!Array.isArray(subGroupArray) || subGroupArray.length === 0) {
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

  subGroupArray.forEach((subGroup, index) => {
    const rowNumber = index + 2;

    const name = String(subGroup.name || subGroup.Name || '').trim();

    const defaultValue = String(subGroup.default || subGroup.Default || '').trim();

    const remark = String(subGroup.remark || subGroup.Remark || '').trim();

    const code = String(subGroup.code || subGroup.Code || '').trim();

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

      totalRecords: subGroupArray.length,

      successCount: 0,

      failedCount: errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate names
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
        error: 'Duplicate item sub group name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing sub groups
   * for this Weaver.
   */
  const existingSubGroups = await WeaverItemSubGroupMaster.find({
    weaverId,
  }).select('name');

  const existingNames = new Set(existingSubGroups.map((subGroup) => subGroup.name.trim().toLowerCase()));

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
        error: 'Item Sub Group already exists',
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
      insertedRecords = await WeaverItemSubGroupMaster.insertMany(recordsToInsert, {
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

    totalRecords: subGroupArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Sub Group Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemSubGroupMaster>}
 */
const updateWeaverItemSubGroupMasterById = async (id, updateBody) => {
  const subGroup = await getWeaverItemSubGroupMasterById(id);

  Object.assign(subGroup, updateBody);

  await subGroup.save();

  return subGroup;
};

/**
 * Delete Weaver Item Sub Group Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemSubGroupMaster>}
 */
const deleteWeaverItemSubGroupMasterById = async (id) => {
  const subGroup = await getWeaverItemSubGroupMasterById(id);

  await subGroup.deleteOne();

  return subGroup;
};

module.exports = {
  createWeaverItemSubGroupMaster,
  queryWeaverItemSubGroupMaster,
  getWeaverItemSubGroupMasterById,
  searchWeaverItemSubGroupMaster,
  bulkUpload,
  updateWeaverItemSubGroupMasterById,
  deleteWeaverItemSubGroupMasterById,
};
