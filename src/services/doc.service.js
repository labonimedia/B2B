const httpStatus = require('http-status');
const { Doc } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Doc
 * @param {Object} reqBody
 * @returns {Promise<Doc>}
 */
const createDoc = async (reqBody) => {
  return Doc.create(reqBody);
};

/**
 * Query for Doc
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDoc = async (filter, options) => {
  const docs = await Doc.paginate(filter, options);
  return docs;
};

/**
 * Get Doc by id
 * @param {ObjectId} id
 * @returns {Promise<Doc>}
 */
const getDocById = async (id) => {
  return Doc.findById(id);
};

/**
 * Update Doc by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Doc>}
 */
const updateDocById = async (id, updateBody) => {
  const user = await getDocById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Doc>}
 */
const deleteDocById = async (id) => {
  const user = await getDocById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createDoc,
  queryDoc,
  getDocById,
  updateDocById,
  deleteDocById,
};
