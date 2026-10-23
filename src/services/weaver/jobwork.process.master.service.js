const httpStatus = require('http-status');

const { WeaverJobworkProcessMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Jobwork Process Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverJobworkProcessMaster>}
 */
const createWeaverJobworkProcessMaster = async (reqBody) => {
  return WeaverJobworkProcessMaster.create(reqBody);
};

/**
 * Query Weaver Jobwork Process Masters
 *
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverJobworkProcessMaster = async (filter, options) => {
  const processes = await WeaverJobworkProcessMaster.paginate(filter, options);

  return processes;
};

/**
 * Get Weaver Jobwork Process Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverJobworkProcessMaster>}
 */
const getWeaverJobworkProcessMasterById = async (id) => {
  const process = await WeaverJobworkProcessMaster.findById(id);

  if (!process) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Jobwork Process Master not found');
  }

  return process;
};

/**
 * Search Weaver Jobwork Process Masters
 *
 * Searches:
 * - processCode
 * - processName
 * - processType
 * - remarks
 * - weaverEmail
 *
 * Search is restricted to the specified Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverJobworkProcessMaster = async (searchBody) => {
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
        processName: {
          $regex: searchRegex,
        },
      },
      {
        processType: {
          $regex: searchRegex,
        },
      },
      {
        remarks: {
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
     * Search numeric fields
     */
    if (!Number.isNaN(Number(searchKeyword))) {
      const numericValue = Number(searchKeyword);

      filter.$or.push(
        {
          processCode: numericValue,
        },
        {
          orderBy: numericValue,
        }
      );
    }
  }

  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverJobworkProcessMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Jobwork Process Masters
 *
 * CSV format:
 *
 * processCode,processName,orderBy,processType,remarks
 *
 * @param {Array<Object>} processArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (processArray = [], user) => {
  if (!Array.isArray(processArray) || processArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing or empty CSV data');
  }

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  /**
   * Get Weaver information
   */
  const weaverId = user.weaverId || user._id;

  const weaverEmail = user.email;

  if (!weaverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Weaver ID not found');
  }

  if (!weaverEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Weaver email not found');
  }

  const validRecords = [];
  const errors = [];

  /**
   * Validate CSV records
   */
  processArray.forEach((process, index) => {
    const rowNumber = index + 2;

    const processCodeValue = process.processCode ?? process.Process_Code ?? process.ProcessCode;

    const processName = String(process.processName || process.Process_Name || process.ProcessName || '').trim();

    const orderByValue = process.orderBy ?? process.Order_By ?? process.OrderBy;

    const processType = String(process.processType || process.Process_Type || process.ProcessType || 'Regular').trim();

    const remarks = String(process.remarks || process.Remarks || '').trim();

    /**
     * Process code validation
     */
    if (processCodeValue === undefined || processCodeValue === null || String(processCodeValue).trim() === '') {
      errors.push({
        row: rowNumber,
        processName,
        error: 'Process code is required',
      });

      return;
    }

    const processCode = Number(processCodeValue);

    if (Number.isNaN(processCode)) {
      errors.push({
        row: rowNumber,
        processName,
        error: 'Process code must be a valid number',
      });

      return;
    }

    /**
     * Process name validation
     */
    if (!processName) {
      errors.push({
        row: rowNumber,
        processName: '',
        error: 'Process name is required',
      });

      return;
    }

    /**
     * Order By
     */
    let orderBy = 0;

    if (orderByValue !== undefined && orderByValue !== null && String(orderByValue).trim() !== '') {
      orderBy = Number(orderByValue);

      if (Number.isNaN(orderBy)) {
        errors.push({
          row: rowNumber,
          processName,
          error: 'Order by must be a valid number',
        });

        return;
      }
    }

    /**
     * Process Type validation
     */
    const allowedProcessTypes = ['Regular', 'Create Job', 'Complete Job'];

    if (!allowedProcessTypes.includes(processType)) {
      errors.push({
        row: rowNumber,
        processName,
        error: 'Process type must be Regular, Create Job or Complete Job',
      });

      return;
    }

    validRecords.push({
      processCode,
      processName,
      orderBy,
      processType,
      remarks,
      isActive: true,
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
      totalRecords: processArray.length,
      successCount: 0,
      failedCount: errors.length,
      errors,
      data: [],
    };
  }

  /**
   * Remove duplicate process codes
   * from uploaded CSV
   */
  const uniqueRecords = [];

  const duplicateCodes = new Set();

  validRecords.forEach((record, index) => {
    const codeKey = String(record.processCode);

    if (duplicateCodes.has(codeKey)) {
      errors.push({
        row: index + 2,
        processCode: record.processCode,
        processName: record.processName,
        error: 'Duplicate process code in uploaded file',
      });

      return;
    }

    duplicateCodes.add(codeKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing process codes
   * for this Weaver
   */
  const existingProcesses = await WeaverJobworkProcessMaster.find({
    weaverId,
    processCode: {
      $in: uniqueRecords.map((record) => record.processCode),
    },
  }).select('processCode processName');

  const existingCodes = new Set(existingProcesses.map((process) => String(process.processCode)));

  /**
   * Remove existing process codes
   */
  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    if (existingCodes.has(String(record.processCode))) {
      errors.push({
        row: index + 2,
        processCode: record.processCode,
        processName: record.processName,
        error: 'Process code already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });

  /**
   * Insert records
   */
  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords = await WeaverJobworkProcessMaster.insertMany(recordsToInsert, {
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
    totalRecords: processArray.length,
    successCount: insertedRecords.length,
    failedCount: errors.length,
    errors,
    data: insertedRecords,
  };
};

/**
 * Update Weaver Jobwork Process Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverJobworkProcessMaster>}
 */
const updateWeaverJobworkProcessMasterById = async (id, updateBody) => {
  const process = await getWeaverJobworkProcessMasterById(id);

  Object.assign(process, updateBody);

  await process.save();

  return process;
};

/**
 * Delete Weaver Jobwork Process Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverJobworkProcessMaster>}
 */
const deleteWeaverJobworkProcessMasterById = async (id) => {
  const process = await getWeaverJobworkProcessMasterById(id);

  await process.deleteOne();

  return process;
};

module.exports = {
  createWeaverJobworkProcessMaster,
  queryWeaverJobworkProcessMaster,
  getWeaverJobworkProcessMasterById,
  searchWeaverJobworkProcessMaster,
  bulkUpload,
  updateWeaverJobworkProcessMasterById,
  deleteWeaverJobworkProcessMasterById,
};
