const httpStatus = require('http-status');

const {
  WeaverBrokerMaster,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Broker Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverBrokerMaster>}
 */
const createWeaverBrokerMaster = async (
  reqBody
) => {
  return WeaverBrokerMaster.create(
    reqBody
  );
};

/**
 * Query Weaver Broker Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverBrokerMaster = async (
  filter,
  options
) => {
  const brokers =
    await WeaverBrokerMaster.paginate(
      filter,
      options
    );

  return brokers;
};

/**
 * Get Weaver Broker Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverBrokerMaster>}
 */
const getWeaverBrokerMasterById =
  async (id) => {
    const broker =
      await WeaverBrokerMaster.findById(
        id
      );

    if (!broker) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Broker Master not found'
      );
    }

    return broker;
  };

/**
 * Search Weaver Broker Masters
 *
 * Searches:
 * - name
 * - contactNo
 * - district
 * - address
 * - default
 * - gstNo
 * - city
 * - pan
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverBrokerMaster =
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
          contactNo: {
            $regex: searchRegex,
          },
        },
        {
          district: {
            $regex: searchRegex,
          },
        },
        {
          address: {
            $regex: searchRegex,
          },
        },
        {
          default: {
            $regex: searchRegex,
          },
        },
        {
          gstNo: {
            $regex: searchRegex,
          },
        },
        {
          city: {
            $regex: searchRegex,
          },
        },
        {
          pan: {
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

    return WeaverBrokerMaster.paginate(
      filter,
      options
    );
  };

/**
 * Bulk Upload Weaver Broker Masters
 *
 * CSV format:
 *
 * name,contactNo,brokeragePercentage,
 * district,address,default,gstNo,city,pan
 *
 * @param {Array<Object>} brokerArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (
  brokerArray = [],
  user
) => {
  if (
    !Array.isArray(brokerArray) ||
    brokerArray.length === 0
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

  brokerArray.forEach(
    (broker, index) => {
      const rowNumber =
        index + 2;

      const name = String(
        broker.name ||
          broker.Name ||
          ''
      ).trim();

      const contactNo = String(
        broker.contactNo ||
          broker.Contact_No ||
          broker.ContactNo ||
          ''
      ).trim();

      const brokeragePercentageValue =
        broker.brokeragePercentage ??
        broker.Brokerage_Percentage ??
        broker.BrokeragePercentage ??
        0;

      const district = String(
        broker.district ||
          broker.District ||
          ''
      ).trim();

      const address = String(
        broker.address ||
          broker.Address ||
          ''
      ).trim();

      const defaultValue = String(
        broker.default ||
          broker.Default ||
          ''
      ).trim();

      const gstNo = String(
        broker.gstNo ||
          broker.GST_No ||
          broker.GSTNo ||
          ''
      ).trim();

      const city = String(
        broker.city ||
          broker.City ||
          ''
      ).trim();

      const pan = String(
        broker.pan ||
          broker.PAN ||
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

      /**
       * District is required
       */
      if (!district) {
        errors.push({
          row: rowNumber,
          name,
          error: 'District is required',
        });

        return;
      }

      /**
       * Validate brokerage percentage
       */
      const brokeragePercentage =
        Number(
          brokeragePercentageValue
        );

      if (
        Number.isNaN(
          brokeragePercentage
        ) ||
        brokeragePercentage < 0
      ) {
        errors.push({
          row: rowNumber,
          name,
          error:
            'Brokerage percentage must be a valid positive number',
        });

        return;
      }

      validRecords.push({
        name,
        contactNo,
        brokeragePercentage,
        district,
        address,
        default: defaultValue,
        gstNo,
        city,
        pan,
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
        brokerArray.length,

      successCount: 0,

      failedCount:
        errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate broker names
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
            'Duplicate broker name in uploaded file',
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
   * Check existing brokers
   * for this Weaver.
   */
  const existingBrokers =
    await WeaverBrokerMaster.find(
      {
        weaverId,
      }
    ).select('name');

  const existingNames =
    new Set(
      existingBrokers.map(
        (broker) =>
          broker.name
            .trim()
            .toLowerCase()
      )
    );

  /**
   * Remove existing brokers
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
            'Broker already exists',
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
        await WeaverBrokerMaster.insertMany(
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
      brokerArray.length,

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
 * Update Weaver Broker Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverBrokerMaster>}
 */
const updateWeaverBrokerMasterById =
  async (
    id,
    updateBody
  ) => {
    const broker =
      await getWeaverBrokerMasterById(
        id
      );

    Object.assign(
      broker,
      updateBody
    );

    await broker.save();

    return broker;
  };

/**
 * Delete Weaver Broker Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverBrokerMaster>}
 */
const deleteWeaverBrokerMasterById =
  async (id) => {
    const broker =
      await getWeaverBrokerMasterById(
        id
      );

    await broker.deleteOne();

    return broker;
  };

module.exports = {
  createWeaverBrokerMaster,
  queryWeaverBrokerMaster,
  getWeaverBrokerMasterById,
  searchWeaverBrokerMaster,
  bulkUpload,
  updateWeaverBrokerMasterById,
  deleteWeaverBrokerMasterById,
};