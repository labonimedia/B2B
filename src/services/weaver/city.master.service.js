const httpStatus = require('http-status');
const { WeaverCityMaster } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver City Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverCityMaster>}
 */
const createWeaverCityMaster = async (reqBody) => {
  return WeaverCityMaster.create(reqBody);
};

/**
 * Query Weaver City Masters
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverCityMaster = async (filter, options) => {
  const cities = await WeaverCityMaster.paginate(
    filter,
    options
  );

  return cities;
};

/**
 * Get Weaver City Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverCityMaster>}
 */
const getWeaverCityMasterById = async (id) => {
  const city = await WeaverCityMaster.findById(id);

  if (!city) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'City Master not found'
    );
  }

  return city;
};

/**
 * Search Weaver City Masters
 *
 * Searches:
 * - name
 * - stateName
 * - remark
 * - cityCode
 * - wholeSaleRate
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverCityMaster = async (searchBody) => {
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

  const searchKeyword = String(keyword).trim();

  /**
   * Search by keyword
   */
  if (searchKeyword) {
    const escapedKeyword = searchKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const searchRegex = new RegExp(
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
        stateName: {
          $regex: searchRegex,
        },
      },
      {
        remark: {
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
     * cityCode and wholeSaleRate
     * are Number fields.
     *
     * If keyword is numeric,
     * search those fields too.
     */
    if (!Number.isNaN(Number(searchKeyword))) {
      const numericValue = Number(searchKeyword);

      filter.$or.push(
        {
          cityCode: numericValue,
        },
        {
          wholeSaleRate: numericValue,
        }
      );
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

  return WeaverCityMaster.paginate(
    filter,
    options
  );
};

/**
 * Bulk Upload Weaver City Masters
 *
 * CSV format:
 *
 * name,stateName,remark,cityCode,wholeSaleRate
 *
 * @param {Array<Object>} cityArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (
  cityArray = [],
  user
) => {
  if (
    !Array.isArray(cityArray) ||
    cityArray.length === 0
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

  cityArray.forEach((city, index) => {
    const rowNumber = index + 2;

    const name = String(
      city.name ||
        city.Name ||
        ''
    ).trim();

    const stateName = String(
      city.stateName ||
        city.State_Name ||
        city.StateName ||
        ''
    ).trim();

    const remark = String(
      city.remark ||
        city.Remark ||
        ''
    ).trim();

    const cityCodeValue =
      city.cityCode ??
      city.City_Code ??
      city.CityCode;

    const wholeSaleRateValue =
      city.wholeSaleRate ??
      city.WholeSale_Rate ??
      city.WholeSaleRate;

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
     * State validation
     */
    if (!stateName) {
      errors.push({
        row: rowNumber,
        name,
        error: 'State name is required',
      });

      return;
    }

    /**
     * City code validation
     */
    if (
      cityCodeValue === undefined ||
      cityCodeValue === null ||
      String(cityCodeValue).trim() === ''
    ) {
      errors.push({
        row: rowNumber,
        name,
        error: 'City code is required',
      });

      return;
    }

    const cityCode = Number(
      cityCodeValue
    );

    if (Number.isNaN(cityCode)) {
      errors.push({
        row: rowNumber,
        name,
        error:
          'City code must be a valid number',
      });

      return;
    }

    /**
     * Wholesale rate validation
     */
    if (
      wholeSaleRateValue === undefined ||
      wholeSaleRateValue === null ||
      String(wholeSaleRateValue).trim() === ''
    ) {
      errors.push({
        row: rowNumber,
        name,
        error:
          'Wholesale rate is required',
      });

      return;
    }

    const wholeSaleRate = Number(
      wholeSaleRateValue
    );

    if (
      Number.isNaN(wholeSaleRate) ||
      wholeSaleRate < 0
    ) {
      errors.push({
        row: rowNumber,
        name,
        error:
          'Wholesale rate must be a valid positive number',
      });

      return;
    }

    /**
     * Valid record
     */
    validRecords.push({
      name,
      stateName,
      remark,
      cityCode,
      wholeSaleRate,
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
      totalRecords: cityArray.length,
      successCount: 0,
      failedCount: errors.length,
      errors,
      data: [],
    };
  }

  /**
   * Remove duplicate city names
   * from uploaded CSV.
   *
   * Case-insensitive.
   */
  const uniqueRecords = [];
  const duplicateNames = new Set();

  validRecords.forEach((record, index) => {
    const nameKey = record.name
      .trim()
      .toLowerCase();

    if (duplicateNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error:
          'Duplicate city name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing cities
   * for this Weaver.
   */
  const existingCities =
    await WeaverCityMaster.find({
      weaverId,
    }).select('name');

  const existingNames = new Set(
    existingCities.map((city) =>
      city.name
        .trim()
        .toLowerCase()
    )
  );

  /**
   * Remove existing cities
   */
  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    const nameKey = record.name
      .trim()
      .toLowerCase();

    if (existingNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'City already exists',
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
      insertedRecords =
        await WeaverCityMaster.insertMany(
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
      cityArray.length,

    successCount:
      insertedRecords.length,

    failedCount:
      errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver City Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverCityMaster>}
 */
const updateWeaverCityMasterById = async (
  id,
  updateBody
) => {
  const city =
    await getWeaverCityMasterById(id);

  Object.assign(
    city,
    updateBody
  );

  await city.save();

  return city;
};

/**
 * Delete Weaver City Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverCityMaster>}
 */
const deleteWeaverCityMasterById = async (
  id
) => {
  const city =
    await getWeaverCityMasterById(id);

  await city.deleteOne();

  return city;
};

module.exports = {
  createWeaverCityMaster,
  queryWeaverCityMaster,
  getWeaverCityMasterById,
  searchWeaverCityMaster,
  bulkUpload,
  updateWeaverCityMasterById,
  deleteWeaverCityMasterById,
};