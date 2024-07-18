const httpStatus = require('http-status');
const { LenthWomenDress } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a LenthWomenDress
 * @param {Object} reqBody
 * @returns {Promise<LenthWomenDress>}
 */
const createLenthWomenDress = async (reqBody) => {
  return LenthWomenDress.create(reqBody);
};

/**
 * Query for LenthWomenDress
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLenthWomenDress = async (filter, options) => {
  const LenthWomenDress = await LenthWomenDress.paginate(filter, options);
  return LenthWomenDress;
};

/**
 * Get LenthWomenDress by id
 * @param {ObjectId} id
 * @returns {Promise<LenthWomenDress>}
 */
const getLenthWomenDressById = async (id) => {
  return LenthWomenDress.findById(id);
};


/**
 * Update LenthWomenDress by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<LenthWomenDress>}
 */
const updateLenthWomenDressById = async (id, updateBody) => {
  const user = await getLenthWomenDressById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LenthWomenDress not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<LenthWomenDress>}
 */
const deleteLenthWomenDressById = async (id) => {
  const user = await getLenthWomenDressById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LenthWomenDress not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createLenthWomenDress,
  queryLenthWomenDress,
  getLenthWomenDressById,
  updateLenthWomenDressById,
  deleteLenthWomenDressById,
};
