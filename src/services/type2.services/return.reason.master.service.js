const httpStatus = require('http-status');
const { ReturnReason } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Bulk upload HSN GST records (allowing duplicates)
 * @param {Array<Object>} dataArray
 * @returns {Promise<Array<HsnGst>>}
 */
const bulkUploadReturnReason = async (dataArray) => {
  const results = await ReturnReason.insertMany(dataArray, { ordered: false });
  return results;
};

/**
 * Create a ReturnReason
 * @param {Object} reqBody
 * @returns {Promise<ReturnReason>}
 */
const createReturnReason = async (reqBody) => {
  return ReturnReason.create(reqBody);
};

/**
 * Query for ReturnReason
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReturnReason = async (filter, options) => {
  const returnReason = await ReturnReason.paginate(filter, options);
  return returnReason;
};

/**
 * Get ReturnReason by id
 * @param {ObjectId} id
 * @returns {Promise<ReturnReason>}
 */
const getReturnReasonById = async (id) => {
  return ReturnReason.findById(id);
};

/**
 * Update ReturnReason by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ReturnReason>}
 */
const updateReturnReasonById = async (id, updateBody) => {
  const returnReason = await getReturnReasonById(id);
  if (!returnReason) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ReturnReason not found');
  }
  Object.assign(returnReason, updateBody);
  await returnReason.save();
  return returnReason;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<ReturnReason>}
 */
const deleteReturnReasonById = async (id) => {
  const returnReason = await getReturnReasonById(id);
  if (!returnReason) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ReturnReason not found');
  }
  await returnReason.remove();
  return returnReason;
};

module.exports = {
  createReturnReason,
  queryReturnReason,
  getReturnReasonById,
  updateReturnReasonById,
  deleteReturnReasonById,
  bulkUploadReturnReason,
};
