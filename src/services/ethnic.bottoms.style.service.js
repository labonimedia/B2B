const httpStatus = require('http-status');
const { EthnicBottomsStyle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a EthnicBottomsStyle
 * @param {Object} reqBody
 * @returns {Promise<EthnicBottomsStyle>}
 */
const createEthnicBottomsStyle = async (reqBody) => {
  return EthnicBottomsStyle.create(reqBody);
};

/**
 * Query for EthnicBottomsStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEthnicBottomsStyle = async (filter, options) => {
  const ethnicBottomsStyles = await EthnicBottomsStyle.paginate(filter, options);
  return ethnicBottomsStyles;
};

/**
 * Get EthnicBottomsStyle by id
 * @param {ObjectId} id
 * @returns {Promise<EthnicBottomsStyle>}
 */
const getEthnicBottomsStyleById = async (id) => {
  return EthnicBottomsStyle.findById(id);
};

/**
 * Update EthnicBottomsStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<EthnicBottomsStyle>}
 */
const updateEthnicBottomsStyleById = async (id, updateBody) => {
  const user = await getEthnicBottomsStyleById(id);
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
 * @returns {Promise<EthnicBottomsStyle>}
 */
const deleteEthnicBottomsStyleById = async (id) => {
  const user = await getEthnicBottomsStyleById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createEthnicBottomsStyle,
  queryEthnicBottomsStyle,
  getEthnicBottomsStyleById,
  updateEthnicBottomsStyleById,
  deleteEthnicBottomsStyleById,
};
