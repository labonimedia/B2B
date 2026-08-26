const httpStatus = require('http-status');

const {
  WeaverTransporterMaster,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Transporter Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverTransporterMaster>}
 */
const createWeaverTransporterMaster = async (
  reqBody
) => {
  return WeaverTransporterMaster.create(
    reqBody
  );
};

/**
 * Query Weaver Transporter Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverTransporterMaster = async (
  filter,
  options
) => {
  const transporters =
    await WeaverTransporterMaster.paginate(
      filter,
      options
    );

  return transporters;
};

/**
 * Get Weaver Transporter Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverTransporterMaster>}
 */
const getWeaverTransporterMasterById =
  async (id) => {
    const transporter =
      await WeaverTransporterMaster.findById(
        id
      );

    if (!transporter) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Transporter Master not found'
      );
    }

    return transporter;
  };

/**
 * Search Weaver Transporter Masters
 *
 * Searches:
 * - name
 * - contactNo
 * - district
 * - address
 * - gstNo
 * - city
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverTransporterMaster =
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

    return WeaverTransporterMaster.paginate(
      filter,
      options
    );
  };

/**
 * Bulk Upload Weaver Transporter Masters
 *
 * CSV format:
 *
 * name,contactNo,district,address,gstNo,city
 *
 * @param {Array<Object>} transporterArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (
  transporterArray = [],
  user
) => {
  if (
    !Array.isArray(transporterArray) ||
    transporterArray.length === 0
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

  transporterArray.forEach(
    (transporter, index) => {
      const rowNumber =
        index + 2;

      const name = String(
        transporter.name ||
          transporter.Name ||
          ''
      ).trim();

      const contactNo = String(
        transporter.contactNo ||
          transporter.Contact_No ||
          transporter.ContactNo ||
          ''
      ).trim();

      const district = String(
        transporter.district ||
          transporter.District ||
          ''
      ).trim();

      const address = String(
        transporter.address ||
          transporter.Address ||
          ''
      ).trim();

      const gstNo = String(
        transporter.gstNo ||
          transporter.GST_No ||
          transporter.GSTNo ||
          ''
      ).trim();

      const city = String(
        transporter.city ||
          transporter.City ||
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

      validRecords.push({
        name,
        contactNo,
        district,
        address,
        gstNo,
        city,
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
        transporterArray.length,

      successCount: 0,

      failedCount:
        errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate transporter names
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
            'Duplicate transporter name in uploaded file',
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
   * Check existing transporters
   * for this Weaver.
   */
  const existingTransporters =
    await WeaverTransporterMaster.find(
      {
        weaverId,
      }
    ).select('name');

  const existingNames =
    new Set(
      existingTransporters.map(
        (transporter) =>
          transporter.name
            .trim()
            .toLowerCase()
      )
    );

  /**
   * Remove existing transporters
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
            'Transporter already exists',
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
        await WeaverTransporterMaster.insertMany(
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
      transporterArray.length,

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
 * Update Weaver Transporter Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverTransporterMaster>}
 */
const updateWeaverTransporterMasterById =
  async (
    id,
    updateBody
  ) => {
    const transporter =
      await getWeaverTransporterMasterById(
        id
      );

    Object.assign(
      transporter,
      updateBody
    );

    await transporter.save();

    return transporter;
  };

/**
 * Delete Weaver Transporter Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverTransporterMaster>}
 */
const deleteWeaverTransporterMasterById =
  async (id) => {
    const transporter =
      await getWeaverTransporterMasterById(
        id
      );

    await transporter.deleteOne();

    return transporter;
  };

module.exports = {
  createWeaverTransporterMaster,
  queryWeaverTransporterMaster,
  getWeaverTransporterMasterById,
  searchWeaverTransporterMaster,
  bulkUpload,
  updateWeaverTransporterMasterById,
  deleteWeaverTransporterMasterById,
};