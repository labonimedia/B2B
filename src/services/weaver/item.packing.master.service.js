const httpStatus = require('http-status');

const { WeaverItemPackingMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Packing Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemPackingMaster>}
 */
const createWeaverItemPackingMaster = async (reqBody) => {
  return WeaverItemPackingMaster.create(reqBody);
};

/**
 * Query Weaver Item Packing Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemPackingMaster = async (filter, options) => {
  const packings = await WeaverItemPackingMaster.paginate(filter, options);

  return packings;
};

/**
 * Get Weaver Item Packing Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemPackingMaster>}
 */
const getWeaverItemPackingMasterById = async (id) => {
  const packing = await WeaverItemPackingMaster.findById(id);

  if (!packing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Packing Master not found');
  }

  return packing;
};

/**
 * Search Weaver Item Packing Masters
 *
 * Searches:
 * - name
 * - remark
 * - rate
 * - code
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverItemPackingMaster = async (searchBody) => {
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

    /**
     * Rate is a Number field.
     *
     * If keyword is numeric,
     * search rate too.
     */
    if (!Number.isNaN(Number(searchKeyword))) {
      const numericValue = Number(searchKeyword);

      filter.$or.push({
        rate: numericValue,
      });
    }
  }

  /**
   * Pagination / sorting options
   */
  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverItemPackingMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Packing Masters
 *
 * CSV format:
 *
 * name,remark,rate,code
 *
 * @param {Array<Object>} packingArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (packingArray = [], user) => {
  if (!Array.isArray(packingArray) || packingArray.length === 0) {
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

  packingArray.forEach((packing, index) => {
    const rowNumber = index + 2;

    const name = String(packing.name || packing.Name || '').trim();

    const remark = String(packing.remark || packing.Remark || '').trim();

    const code = String(packing.code || packing.Code || '').trim();

    const rateValue = packing.rate ?? packing.Rate;

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

    /**
     * Rate is optional according
     * to the model.
     */
    let rate;

    if (rateValue !== undefined && rateValue !== null && String(rateValue).trim() !== '') {
      rate = Number(rateValue);

      if (Number.isNaN(rate) || rate < 0) {
        errors.push({
          row: rowNumber,
          name,
          error: 'Rate must be a valid positive number',
        });

        return;
      }
    }

    validRecords.push({
      name,
      remark,
      code,
      ...(rate !== undefined && {
        rate,
      }),
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

      totalRecords: packingArray.length,

      successCount: 0,

      failedCount: errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate packing names
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
        error: 'Duplicate packing name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing packing records
   * for this Weaver.
   */
  const existingPackings = await WeaverItemPackingMaster.find({
    weaverId,
  }).select('name');

  const existingNames = new Set(existingPackings.map((packing) => packing.name.trim().toLowerCase()));

  /**
   * Remove existing packing records
   */
  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    const nameKey = record.name.trim().toLowerCase();

    if (existingNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Item Packing already exists',
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
      insertedRecords = await WeaverItemPackingMaster.insertMany(recordsToInsert, {
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

    totalRecords: packingArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Packing Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemPackingMaster>}
 */
const updateWeaverItemPackingMasterById = async (id, updateBody) => {
  const packing = await getWeaverItemPackingMasterById(id);

  Object.assign(packing, updateBody);

  await packing.save();

  return packing;
};

/**
 * Delete Weaver Item Packing Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemPackingMaster>}
 */
const deleteWeaverItemPackingMasterById = async (id) => {
  const packing = await getWeaverItemPackingMasterById(id);

  await packing.deleteOne();

  return packing;
};

module.exports = {
  createWeaverItemPackingMaster,
  queryWeaverItemPackingMaster,
  getWeaverItemPackingMasterById,
  searchWeaverItemPackingMaster,
  bulkUpload,
  updateWeaverItemPackingMasterById,
  deleteWeaverItemPackingMasterById,
};
