const httpStatus = require('http-status');
const { EthnicDesign } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a EthnicDesign
 * @param {Object} reqBody
 * @returns {Promise<EthnicDesign>}
 */
const createEthnicDesign = async (reqBody) => {
  return EthnicDesign.create(reqBody);
};

/**
 * Query for EthnicDesign
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEthnicDesign = async (filter, options) => {
  const ethnicDesigns = await EthnicDesign.paginate(filter, options);
  return ethnicDesigns;
};

/**
 * Get EthnicDesign by id
 * @param {ObjectId} id
 * @returns {Promise<EthnicDesign>}
 */
const getEthnicDesignById = async (id) => {
  return EthnicDesign.findById(id);
};

/**
 * Update EthnicDesign by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<EthnicDesign>}
 */
const updateEthnicDesignById = async (id, updateBody) => {
  const user = await getEthnicDesignById(id);
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
 * @returns {Promise<EthnicDesign>}
 */
const deleteEthnicDesignById = async (id) => {
  const user = await getEthnicDesignById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createEthnicDesign,
  queryEthnicDesign,
  getEthnicDesignById,
  updateEthnicDesignById,
  deleteEthnicDesignById,
};
