const httpStatus = require('http-status');

const { WeaverItemLotDesignMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Lot Design Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemLotDesignMaster>}
 */
const createWeaverItemLotDesignMaster = async (reqBody) => {
  return WeaverItemLotDesignMaster.create(reqBody);
};

/**
 * Query Weaver Item Lot Design Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemLotDesignMaster = async (filter, options) => {
  const lotDesigns = await WeaverItemLotDesignMaster.paginate(filter, options);

  return lotDesigns;
};

/**
 * Get Weaver Item Lot Design Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemLotDesignMaster>}
 */
const getWeaverItemLotDesignMasterById = async (id) => {
  const lotDesign = await WeaverItemLotDesignMaster.findById(id);

  if (!lotDesign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Lot Design Master not found');
  }

  return lotDesign;
};

/**
 * Search Weaver Item Lot Design Masters
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
const searchWeaverItemLotDesignMaster = async (searchBody) => {
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

  return WeaverItemLotDesignMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Lot Design Masters
 *
 * CSV format:
 *
 * name,remark,code
 *
 * @param {Array<Object>} lotDesignArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (lotDesignArray = [], user) => {
  if (!Array.isArray(lotDesignArray) || lotDesignArray.length === 0) {
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

  lotDesignArray.forEach((lotDesign, index) => {
    const rowNumber = index + 2;

    const name = String(lotDesign.name || lotDesign.Name || '').trim();

    const remark = String(lotDesign.remark || lotDesign.Remark || '').trim();

    const code = String(lotDesign.code || lotDesign.Code || '').trim();

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

      totalRecords: lotDesignArray.length,

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
        error: 'Duplicate lot design name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing lot designs
   * for this Weaver.
   */
  const existingLotDesigns = await WeaverItemLotDesignMaster.find({
    weaverId,
  }).select('name');

  const existingNames = new Set(existingLotDesigns.map((lotDesign) => lotDesign.name.trim().toLowerCase()));

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
        error: 'Item Lot Design already exists',
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
      insertedRecords = await WeaverItemLotDesignMaster.insertMany(recordsToInsert, {
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

    totalRecords: lotDesignArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Lot Design Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemLotDesignMaster>}
 */
const updateWeaverItemLotDesignMasterById = async (id, updateBody) => {
  const lotDesign = await getWeaverItemLotDesignMasterById(id);

  Object.assign(lotDesign, updateBody);

  await lotDesign.save();

  return lotDesign;
};

/**
 * Delete Weaver Item Lot Design Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemLotDesignMaster>}
 */
const deleteWeaverItemLotDesignMasterById = async (id) => {
  const lotDesign = await getWeaverItemLotDesignMasterById(id);

  await lotDesign.deleteOne();

  return lotDesign;
};

module.exports = {
  createWeaverItemLotDesignMaster,
  queryWeaverItemLotDesignMaster,
  getWeaverItemLotDesignMasterById,
  searchWeaverItemLotDesignMaster,
  bulkUpload,
  updateWeaverItemLotDesignMasterById,
  deleteWeaverItemLotDesignMasterById,
};
