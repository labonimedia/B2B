const httpStatus = require('http-status');
const { Wholesaler, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Wholesaler
 * @param {Object} reqBody
 * @returns {Promise<Wholesaler>}
 */
const createWholesaler = async (reqBody) => {
  return Wholesaler.create(reqBody);
};

/**
 * Query for Wholesaler
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWholesaler = async (filter, options) => {
  const wholesalers = await Wholesaler.paginate(filter, options);
  return wholesalers;
};

/**
 * Get Wholesaler by id
 * @param {ObjectId} id
 * @returns {Promise<Wholesaler>}
 */
const getWholesalerById = async (id) => {
  return Wholesaler.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Wholesaler>}
 */
const getUserByEmail = async (email) => {
  return Wholesaler.findOne({ email });
};

/**
 * Update Wholesaler by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Wholesaler>}
 */
const updateWholesalerById = async (email, updateBody) => {
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
 * @returns {Promise<Wholesaler>}
 */
const deleteWholesalerById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
/**
 * Get user by email
 * @param {ObjectId} email
 * @returns {Promise<User>}
 */

const getUser = async (email) => {
  return User.findOne({ email });
};
/**
 * Get users by email
 * @param {ObjectId} email
 * @returns {Promise<User>}
 */
const getUsersByEmails = async (emails) => {
  return User.find({ email: { $in: emails } });
};

module.exports = {
  createWholesaler,
  queryWholesaler,
  getWholesalerById,
  getUserByEmail,
  updateWholesalerById,
  deleteWholesalerById,
  getUser,
  getUsersByEmails,
};
