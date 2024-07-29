const httpStatus = require('http-status');
const { Manufacture } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a manufacture
 * @param {Object} reqBody
 * @returns {Promise<Manufacture>}
 */
const createManufacture = async (reqBody) => {
  return Manufacture.create(reqBody);
};

/**
 * Query for manufacture
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryManufacture = async (filter, options) => {
  const manufacture = await Manufacture.paginate(filter, options);
  return manufacture;
};

/**
 * Get manufacture by id
 * @param {ObjectId} id
 * @returns {Promise<Manufacture>}
 */
const getManufactureById = async (id) => {
  return Manufacture.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Manufacture>}
 */
const getUserByEmail = async (email) => {
  return Manufacture.findOne({ email });
};

/**
 * Update manufacture by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Manufacture>}
 */
const updateManufactureById = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Manufacture>}
 */
const deleteManufactureById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createManufacture,
  queryManufacture,
  getManufactureById,
  getUserByEmail,
  updateManufactureById,
  deleteManufactureById,
};
