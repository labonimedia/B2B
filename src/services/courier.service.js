const httpStatus = require('http-status');
const { Courier } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Courier
 * @param {Object} reqBody
 * @returns {Promise<Courier>}
 */
const createCourier = async (reqBody) => {
  return Courier.create(reqBody);
};

/**
 * Query for Courier
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCourier = async (filter, options) => {
  const clothingMens = await Courier.paginate(filter, options);
  return clothingMens;
};

/**
 * Get Courier by id
 * @param {ObjectId} id
 * @returns {Promise<Courier>}
 */
const getCourierById = async (id) => {
  return Courier.findById(id);
};

/**
 * Update Courier by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Courier>}
 */
const updateCourierById = async (id, updateBody) => {
  const user = await getCourierById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Courier not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Courier>}
 */
const deleteCourierById = async (id) => {
  const user = await getCourierById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Courier not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCourier,
  queryCourier,
  getCourierById,
  updateCourierById,
  deleteCourierById,
};
