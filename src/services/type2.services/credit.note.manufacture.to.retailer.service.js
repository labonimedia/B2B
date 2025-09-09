const httpStatus = require('http-status');
const { MtoRCreditNote } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Bulk upload HSN GST records (allowing duplicates)
 * @param {Array<Object>} dataArray
 * @returns {Promise<Array<HsnGst>>}
 */
const bulkUploadMtoRCreditNote = async (dataArray) => {
  const results = await MtoRCreditNote.insertMany(dataArray, { ordered: false });
  return results;
};

/**
 * Create a MtoRCreditNote
 * @param {Object} reqBody
 * @returns {Promise<MtoRCreditNote>}
 */
const createMtoRCreditNote = async (reqBody) => {
  return MtoRCreditNote.create(reqBody);
};

/**
 * Query for MtoRCreditNote
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMtoRCreditNote = async (filter, options) => {
  const mtoRCreditNote = await MtoRCreditNote.paginate(filter, options);
  return mtoRCreditNote;
};

/**
 * Get MtoRCreditNote by id
 * @param {ObjectId} id
 * @returns {Promise<MtoRCreditNote>}
 */
const getMtoRCreditNoteById = async (id) => {
  return MtoRCreditNote.findById(id);
};

/**
 * Update MtoRCreditNote by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<MtoRCreditNote>}
 */
const updateMtoRCreditNoteById = async (id, updateBody) => {
  const mtoRCreditNote = await getMtoRCreditNoteById(id);
  if (!mtoRCreditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mtoRCreditNote not found');
  }
  Object.assign(mtoRCreditNote, updateBody);
  await mtoRCreditNote.save();
  return mtoRCreditNote;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<MtoRCreditNote>}
 */
const deleteMtoRCreditNoteById = async (id) => {
  const mtoRCreditNote = await getMtoRCreditNoteById(id);
  if (!mtoRCreditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mtoRCreditNote not found');
  }
  await mtoRCreditNote.remove();
  return mtoRCreditNote;
};

module.exports = {
  createMtoRCreditNote,
  queryMtoRCreditNote,
  getMtoRCreditNoteById,
  updateMtoRCreditNoteById,
  deleteMtoRCreditNoteById,
  bulkUploadMtoRCreditNote,
};
