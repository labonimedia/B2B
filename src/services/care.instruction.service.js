const httpStatus = require('http-status');
const { CareInstruction } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a CareInstruction
 * @param {Object} reqBody
 * @returns {Promise<CareInstruction>}
 */
const createCareInstruction = async (reqBody) => {
  return CareInstruction.create(reqBody);
};

/**
 * Query for CareInstruction
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCareInstruction = async (filter, options) => {
  const CareInstructions = await CareInstruction.paginate(filter, options);
  return CareInstructions;
};

/**
 * Get CareInstruction by id
 * @param {ObjectId} id
 * @returns {Promise<CareInstruction>}
 */
const getCareInstructionById = async (id) => {
  return CareInstruction.findById(id);
};


/**
 * Update CareInstruction by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<CareInstruction>}
 */
const updateCareInstructionById = async (id, updateBody) => {
  const user = await getCareInstructionById(id);
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
 * @returns {Promise<CareInstruction>}
 */
const deleteCareInstructionById = async (id) => {
  const user = await getCareInstructionById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createCareInstruction,
  queryCareInstruction,
  getCareInstructionById,
  updateCareInstructionById,
  deleteCareInstructionById,
};
