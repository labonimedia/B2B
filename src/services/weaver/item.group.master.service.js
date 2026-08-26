const httpStatus = require('http-status');

const {
  WeaverItemGroupMaster,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Group Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemGroupMaster>}
 */
const createWeaverItemGroupMaster = async (
  reqBody
) => {
  return WeaverItemGroupMaster.create(
    reqBody
  );
};

/**
 * Query Weaver Item Group Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemGroupMaster = async (
  filter,
  options
) => {
  const itemGroups =
    await WeaverItemGroupMaster.paginate(
      filter,
      options
    );

  return itemGroups;
};

/**
 * Get Weaver Item Group Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemGroupMaster>}
 */
const getWeaverItemGroupMasterById =
  async (id) => {
    const itemGroup =
      await WeaverItemGroupMaster.findById(
        id
      );

    if (!itemGroup) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Item Group Master not found'
      );
    }

    return itemGroup;
  };

/**
 * Search Weaver Item Group Masters
 *
 * Searches:
 * - name
 * - code
 * - remark
 * - default
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverItemGroupMaster =
  async (searchBody) => {
    const {
      weaverId,
      keyword = '',
      sortBy,
      limit,
      page,
    } = searchBody;

    if (!weaverId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'weaverId is required'
      );
    }

    const filter = {
      weaverId,
    };

    const searchKeyword =
      String(keyword).trim();

    /**
     * Search by keyword
     */
    if (searchKeyword) {
      const escapedKeyword =
        searchKeyword.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );

      const searchRegex =
        new RegExp(
          escapedKeyword,
          'i'
        );

      filter.$or = [
        {
          name: {
            $regex: searchRegex,
          },
        },
        {
          code: {
            $regex: searchRegex,
          },
        },
        {
          remark: {
            $regex: searchRegex,
          },
        },
        {
          default: {
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

    return WeaverItemGroupMaster.paginate(
      filter,
      options
    );
  };

/**
 * Bulk Upload Weaver Item Group Masters
 *
 * CSV format:
 *
 * name,code,remark,default
 *
 * @param {Array<Object>} itemGroupArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (
  itemGroupArray = [],
  user
) => {
  if (
    !Array.isArray(itemGroupArray) ||
    itemGroupArray.length === 0
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Missing or empty CSV data'
    );
  }

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'User authentication required'
    );
  }

  /**
   * Get Weaver information
   * from authenticated user.
   */
  const weaverId =
    user.weaverId || user._id;

  const weaverEmail =
    user.email;

  if (!weaverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Weaver ID not found'
    );
  }

  if (!weaverEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Weaver email not found'
    );
  }

  /**
   * Prepare valid records
   */
  const validRecords = [];
  const errors = [];

  itemGroupArray.forEach(
    (itemGroup, index) => {
      const rowNumber =
        index + 2;

      const name = String(
        itemGroup.name ||
          itemGroup.Name ||
          ''
      ).trim();

      const code = String(
        itemGroup.code ||
          itemGroup.Code ||
          ''
      ).trim();

      const remark = String(
        itemGroup.remark ||
          itemGroup.Remark ||
          ''
      ).trim();

      const defaultValue = String(
        itemGroup.default ||
          itemGroup.Default ||
          ''
      ).trim();

      /**
       * Name is required
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
        code,
        remark,
        default: defaultValue,
        weaverId,
        weaverEmail,
      });
    }
  );

  /**
   * No valid records
   */
  if (!validRecords.length) {
    return {
      message:
        'No valid records found',

      totalRecords:
        itemGroupArray.length,

      successCount: 0,

      failedCount:
        errors.length,

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

  const duplicateNames =
    new Set();

  validRecords.forEach(
    (record, index) => {
      const nameKey =
        record.name
          .trim()
          .toLowerCase();

      if (
        duplicateNames.has(
          nameKey
        )
      ) {
        errors.push({
          row: index + 2,
          name: record.name,
          error:
            'Duplicate item group name in uploaded file',
        });

        return;
      }

      duplicateNames.add(
        nameKey
      );

      uniqueRecords.push(
        record
      );
    }
  );

  /**
   * Check existing Item Groups
   * for this Weaver.
   */
  const existingItemGroups =
    await WeaverItemGroupMaster.find(
      {
        weaverId,
      }
    ).select('name');

  const existingNames =
    new Set(
      existingItemGroups.map(
        (itemGroup) =>
          itemGroup.name
            .trim()
            .toLowerCase()
      )
    );

  /**
   * Remove existing Item Groups
   */
  const recordsToInsert = [];

  uniqueRecords.forEach(
    (record, index) => {
      const nameKey =
        record.name
          .trim()
          .toLowerCase();

      if (
        existingNames.has(
          nameKey
        )
      ) {
        errors.push({
          row: index + 2,
          name: record.name,
          error:
            'Item Group already exists',
        });

        return;
      }

      recordsToInsert.push(
        record
      );
    }
  );

  /**
   * Insert valid records
   */
  let insertedRecords = [];

  if (
    recordsToInsert.length
  ) {
    try {
      insertedRecords =
        await WeaverItemGroupMaster.insertMany(
          recordsToInsert,
          {
            ordered: false,
          }
        );
    } catch (error) {
      if (
        error.writeErrors &&
        error.writeErrors.length
      ) {
        error.writeErrors.forEach(
          (writeError) => {
            errors.push({
              row:
                writeError.index + 2,

              error:
                writeError.errmsg ||
                'Failed to insert record',
            });
          }
        );

        insertedRecords =
          error.insertedDocs || [];
      } else {
        throw error;
      }
    }
  }

  return {
    message:
      'Bulk upload completed successfully',

    totalRecords:
      itemGroupArray.length,

    successCount:
      insertedRecords.length,

    failedCount:
      errors.length,

    errors,

    data:
      insertedRecords,
  };
};

/**
 * Update Weaver Item Group Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemGroupMaster>}
 */
const updateWeaverItemGroupMasterById =
  async (
    id,
    updateBody
  ) => {
    const itemGroup =
      await getWeaverItemGroupMasterById(
        id
      );

    Object.assign(
      itemGroup,
      updateBody
    );

    await itemGroup.save();

    return itemGroup;
  };

/**
 * Delete Weaver Item Group Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemGroupMaster>}
 */
const deleteWeaverItemGroupMasterById =
  async (id) => {
    const itemGroup =
      await getWeaverItemGroupMasterById(
        id
      );

    await itemGroup.deleteOne();

    return itemGroup;
  };

module.exports = {
  createWeaverItemGroupMaster,
  queryWeaverItemGroupMaster,
  getWeaverItemGroupMasterById,
  searchWeaverItemGroupMaster,
  bulkUpload,
  updateWeaverItemGroupMasterById,
  deleteWeaverItemGroupMasterById,
};