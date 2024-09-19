const httpStatus = require('http-status');
const { ApparelSilhouette } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ApparelSilhouette
 * @param {Object} reqBody
 * @returns {Promise<ApparelSilhouette>}
 */
const createApparelSilhouette = async (reqBody) => {
  return ApparelSilhouette.create(reqBody);
};

/**
 * Query for ApparelSilhouette
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryApparelSilhouette = async (filter, options) => {
  const apparelSilhouettes = await ApparelSilhouette.paginate(filter, options);
  return apparelSilhouettes;
};

/**
 * Get ApparelSilhouette by id
 * @param {ObjectId} id
 * @returns {Promise<ApparelSilhouette>}
 */
const getApparelSilhouetteById = async (id) => {
  return ApparelSilhouette.findById(id);
};

/**
 * Update ApparelSilhouette by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ApparelSilhouette>}
 */
const updateApparelSilhouetteById = async (id, updateBody) => {
  const user = await getApparelSilhouetteById(id);
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
 * @returns {Promise<ApparelSilhouette>}
 */
const deleteApparelSilhouetteById = async (id) => {
  const user = await getApparelSilhouetteById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createApparelSilhouette,
  queryApparelSilhouette,
  getApparelSilhouetteById,
  updateApparelSilhouetteById,
  deleteApparelSilhouetteById,
};
