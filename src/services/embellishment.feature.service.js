const httpStatus = require('http-status');
const { EmbellishmentFeatures } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a EmbellishmentFeatures
 * @param {Object} reqBody
 * @returns {Promise<EmbellishmentFeatures>}
 */
const createEmbellishmentFeatures = async (reqBody) => {
  return EmbellishmentFeatures.create(reqBody);
};

/**
 * Query for EmbellishmentFeatures
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmbellishmentFeatures = async (filter, options) => {
  const embellishmentFeatures = await EmbellishmentFeatures.paginate(filter, options);
  return embellishmentFeatures;
};

/**
 * Get EmbellishmentFeatures by id
 * @param {ObjectId} id
 * @returns {Promise<EmbellishmentFeatures>}
 */
const getEmbellishmentFeaturesById = async (id) => {
  return EmbellishmentFeatures.findById(id);
};

/**
 * Update EmbellishmentFeatures by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<EmbellishmentFeatures>}
 */
const updateEmbellishmentFeaturesById = async (id, updateBody) => {
  const user = await getEmbellishmentFeaturesById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'EmbellishmentFeatures not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<EmbellishmentFeatures>}
 */
const deleteEmbellishmentFeaturesById = async (id) => {
  const user = await getEmbellishmentFeaturesById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'EmbellishmentFeatures not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createEmbellishmentFeatures,
  queryEmbellishmentFeatures,
  getEmbellishmentFeaturesById,
  updateEmbellishmentFeaturesById,
  deleteEmbellishmentFeaturesById,
};
