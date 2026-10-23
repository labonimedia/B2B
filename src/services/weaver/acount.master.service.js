const httpStatus = require('http-status');

const {
  WeaverAcountMaster,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create a Weaver Account Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverAcountMaster>}
 */
const createWeaverAcountMaster = async (
  reqBody
) => {
  return WeaverAcountMaster.create(
    reqBody
  );
};

/**
 * Query Weaver Account Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverAcountMaster = async (
  filter,
  options
) => {
  const accounts =
    await WeaverAcountMaster.paginate(
      filter,
      options
    );

  return accounts;
};

/**
 * Get Weaver Account Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverAcountMaster>}
 */
const getWeaverAcountMasterById = async (
  id
) => {
  const account =
    await WeaverAcountMaster.findById(
      id
    );

  if (!account) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Account Master not found'
    );
  }

  return account;
};

/**
 * Search Weaver Account Masters
 *
 * Searches:
 * - name
 * - code
 * - groupName
 * - weaverEmail
 * - GST number
 * - PAN
 * - contact person
 * - contact number
 * - city
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverAcountMaster = async (
  searchBody
) => {
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
        groupName: {
          $regex: searchRegex,
        },
      },
      {
        weaverEmail: {
          $regex: searchRegex,
        },
      },
      {
        gstNo: {
          $regex: searchRegex,
        },
      },
      {
        pan: {
          $regex: searchRegex,
        },
      },
      {
        state: {
          $regex: searchRegex,
        },
      },
      {
        city: {
          $regex: searchRegex,
        },
      },
      {
        pincode: {
          $regex: searchRegex,
        },
      },
      {
        'contactDetails.partyGroup': {
          $regex: searchRegex,
        },
      },
      {
        'contactDetails.contactPerson': {
          $regex: searchRegex,
        },
      },
      {
        'contactDetails.email': {
          $regex: searchRegex,
        },
      },
      {
        'contactDetails.contactNo': {
          $regex: searchRegex,
        },
      },
      {
        'contactDetails.whatsappNo': {
          $regex: searchRegex,
        },
      },
      {
        'contactDetails.area': {
          $regex: searchRegex,
        },
      },
      {
        'brokerDetails.brokerName': {
          $regex: searchRegex,
        },
      },
      {
        'transportDetails.transportName': {
          $regex: searchRegex,
        },
      },
      {
        'transportDetails.station': {
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

  return WeaverAcountMaster.paginate(
    filter,
    options
  );
};

/**
 * Bulk Upload Weaver Account Masters
 *
 * CSV format:
 *
 * name
 * Cash Account
 * Purchase Account
 * Sales Account
 *
 * Weaver information is taken
 * from authenticated user.
 *
 * @param {Array<Object>} accountArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (
  accountArray = [],
  user
) => {
  if (
    !Array.isArray(accountArray) ||
    accountArray.length === 0
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

  accountArray.forEach(
    (account, index) => {
      const rowNumber =
        index + 2;

      const name = String(
        account.name ||
          account.Name ||
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
        accountArray.length,

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
            'Duplicate account name in uploaded file',
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
   * Check existing accounts
   * for this Weaver.
   *
   * We fetch Weaver accounts and
   * compare names case-insensitively.
   */
  const existingAccounts =
    await WeaverAcountMaster.find(
      {
        weaverId,
      }
    ).select('name');

  const existingNames =
    new Set(
      existingAccounts.map(
        (account) =>
          account.name
            .trim()
            .toLowerCase()
      )
    );

  /**
   * Remove existing accounts
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
            'Account already exists',
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
        await WeaverAcountMaster.insertMany(
          recordsToInsert,
          {
            ordered: false,
          }
        );
    } catch (error) {
      /**
       * Handle duplicate key errors
       * caused by race conditions or
       * database-level unique index.
       */
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

        /**
         * insertMany with ordered:false
         * can still insert successful
         * records before failures.
         */
        insertedRecords =
          error.insertedDocs || [];
      } else {
        throw error;
      }
    }
  }

  /**
   * Final result
   */
  return {
    message:
      'Bulk upload completed successfully',

    totalRecords:
      accountArray.length,

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
 * Update Weaver Account Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverAcountMaster>}
 */
const updateWeaverAcountMasterById =
  async (
    id,
    updateBody
  ) => {
    const account =
      await getWeaverAcountMasterById(
        id
      );

    Object.assign(
      account,
      updateBody
    );

    await account.save();

    return account;
  };

/**
 * Delete Weaver Account Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverAcountMaster>}
 */
const deleteWeaverAcountMasterById =
  async (
    id
  ) => {
    const account =
      await getWeaverAcountMasterById(
        id
      );

    await account.deleteOne();

    return account;
  };

module.exports = {
  createWeaverAcountMaster,
  queryWeaverAcountMaster,
  getWeaverAcountMasterById,
  searchWeaverAcountMaster,
  bulkUpload,
  updateWeaverAcountMasterById,
  deleteWeaverAcountMasterById,
};