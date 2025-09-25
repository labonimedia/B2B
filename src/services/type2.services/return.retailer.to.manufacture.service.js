const httpStatus = require('http-status');
const { ReturnR2M } = require('../../models');
const ApiError = require('../../utils/ApiError');


// /**
//  * Create a BackStyle
//  * @param {Object} reqBody
//  * @returns {Promise<BackStyle>}
//  */
// const createMtoRReturnRequest = async (reqBody) => {
//   return ReturnR2M.create(reqBody);
// };
/**
 * Create a new Return Request (Retailer → Manufacturer)
 */

const createMtoRReturnRequest = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "'manufacturerEmail' is required to generate return request number."
    );
  }

  // Get last return request for this manufacturer
  const lastRequest = await ReturnR2M.findOne({ manufacturerEmail })
    .sort({ returnRequestNumber: -1 }) // highest number first
    .lean();

  let nextNumber = 1;
  if (lastRequest && lastRequest.returnRequestNumber) {
    nextNumber = lastRequest.returnRequestNumber + 1;
  }

  reqBody.returnRequestNumber = nextNumber;

  const returnRequest = await ReturnR2M.create(reqBody);
  return returnRequest;
};
/**
 * Query for BackStyle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMtoRReturnRequest = async (filter, options) => {
  const data = await ReturnR2M.paginate(filter, options);
  return data;
};

/**
 * Get BackStyle by id
 * @param {ObjectId} id
 * @returns {Promise<BackStyle>}
 */
const getMtoRReturnRequestById = async (id) => {
  return ReturnR2M.findById(id);
};

/**
 * Update BackStyle by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<BackStyle>}
 */
const updateMtoRReturnRequestById = async (id, updateBody) => {
  const data = await getMtoRReturnRequestById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request  not found');
  }
  Object.assign(data, updateBody);
  await data.save();
  return data;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<BackStyle>}
 */
const deleteMtoRReturnRequestById = async (id) => {
  const data = await getMtoRReturnRequestById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request  not found');
  }
  await data.remove();
  return data;
};

module.exports = {
  createMtoRReturnRequest,
  queryMtoRReturnRequest,
  getMtoRReturnRequestById,
  updateMtoRReturnRequestById,
  deleteMtoRReturnRequestById,
};
