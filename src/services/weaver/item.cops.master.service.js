const httpStatus = require('http-status');

const {
  WeaverItemCopsMaster,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Cops Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemCopsMaster>}
 */
const createWeaverItemCopsMaster = async (
  reqBody
) => {
  return WeaverItemCopsMaster.create(
    reqBody
  );
};

/**
 * Query Weaver Item Cops Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemCopsMaster = async (
  filter,
  options
) => {
  const cops =
    await WeaverItemCopsMaster.paginate(
      filter,
      options
    );

  return cops;
};

/**
 * Get Weaver Item Cops Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemCopsMaster>}
 */
const getWeaverItemCopsMasterById =
  async (id) => {
    const cops =
      await WeaverItemCopsMaster.findById(
        id
      );

    if (!cops) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Item Cops Master not found'
      );
    }

    return cops;
  };

/**
 * Search Weaver Item Cops Masters
 *
 * Searches:
 * - name
 * - remark
 * - code
 * - weight
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverItemCopsMaster =
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
       * Weight is a Number field.
       *
       * If keyword is numeric,
       * search weight too.
       */
      if (
        !Number.isNaN(
          Number(searchKeyword)
        )
      ) {
        const numericValue =
          Number(searchKeyword);

        filter.$or.push({
          weight: numericValue,
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

    return WeaverItemCopsMaster.paginate(
      filter,
      options
    );
  };

/**
 * Bulk Upload Weaver Item Cops Masters
 *
 * CSV format:
 *
 * name,remark,code,weight
 *
 * @param {Array<Object>} copsArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (
  copsArray = [],
  user
) => {
  if (
    !Array.isArray(copsArray) ||
    copsArray.length === 0
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

  copsArray.forEach(
    (cops, index) => {
      const rowNumber =
        index + 2;

      const name = String(
        cops.name ||
          cops.Name ||
          ''
      ).trim();

      const remark = String(
        cops.remark ||
          cops.Remark ||
          ''
      ).trim();

      const code = String(
        cops.code ||
          cops.Code ||
          ''
      ).trim();

      const weightValue =
        cops.weight ??
        cops.Weight;

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
       * Weight validation
       *
       * Weight is optional according
       * to the model.
       */
      let weight = undefined;

      if (
        weightValue !== undefined &&
        weightValue !== null &&
        String(weightValue).trim() !== ''
      ) {
        weight = Number(
          weightValue
        );

        if (
          Number.isNaN(weight)
        ) {
          errors.push({
            row: rowNumber,
            name,
            error:
              'Weight must be a valid number',
          });

          return;
        }
      }

      validRecords.push({
        name,
        remark,
        code,
        ...(weight !== undefined && {
          weight,
        }),
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
        copsArray.length,

      successCount: 0,

      failedCount:
        errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate Cops names
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
            'Duplicate item cops name in uploaded file',
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
   * Check existing Cops
   * for this Weaver.
   */
  const existingCops =
    await WeaverItemCopsMaster.find(
      {
        weaverId,
      }
    ).select('name');

  const existingNames =
    new Set(
      existingCops.map(
        (cops) =>
          cops.name
            .trim()
            .toLowerCase()
      )
    );

  /**
   * Remove existing Cops
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
            'Item Cops already exists',
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
        await WeaverItemCopsMaster.insertMany(
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
      copsArray.length,

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
 * Update Weaver Item Cops Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemCopsMaster>}
 */
const updateWeaverItemCopsMasterById =
  async (
    id,
    updateBody
  ) => {
    const cops =
      await getWeaverItemCopsMasterById(
        id
      );

    Object.assign(
      cops,
      updateBody
    );

    await cops.save();

    return cops;
  };

/**
 * Delete Weaver Item Cops Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemCopsMaster>}
 */
const deleteWeaverItemCopsMasterById =
  async (id) => {
    const cops =
      await getWeaverItemCopsMasterById(
        id
      );

    await cops.deleteOne();

    return cops;
  };

module.exports = {
  createWeaverItemCopsMaster,
  queryWeaverItemCopsMaster,
  getWeaverItemCopsMasterById,
  searchWeaverItemCopsMaster,
  bulkUpload,
  updateWeaverItemCopsMasterById,
  deleteWeaverItemCopsMasterById,
};