const httpStatus = require('http-status');
const { ReturnOrder } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ReturnOrder
 * @param {Object} reqBody
 * @returns {Promise<ReturnOrder>}
 */
const createReturnOrder = async (reqBody) => {
  return ReturnOrder.create(reqBody);
};

/**
 * Query for ReturnOrder
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReturnOrder = async (filter, options) => {
  const returnOrder = await ReturnOrder.paginate(filter, options);
  return returnOrder;
};

/**
 * Get ReturnOrder by id
 * @param {ObjectId} id
 * @returns {Promise<ReturnOrder>}
 */
const getReturnOrderById = async (id) => {
  return ReturnOrder.findById(id);
};

/**
 * Update ReturnOrder by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ReturnOrder>}
 */
const updateReturnOrderById = async (id, updateBody) => {
  const returnOrder = await getReturnOrderById(id);
  if (!returnOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ReturnOrder not found');
  }
  Object.assign(returnOrder, updateBody);
  await returnOrder.save();
  return returnOrder;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<ReturnOrder>}
 */
const deleteReturnOrderById = async (id) => {
  const returnOrder = await getReturnOrderById(id);
  if (!returnOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ReturnOrder not found');
  }
  await returnOrder.remove();
  return returnOrder;
};

module.exports = {
  createReturnOrder,
  queryReturnOrder,
  getReturnOrderById,
  updateReturnOrderById,
  deleteReturnOrderById,
};
