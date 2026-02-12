const httpStatus = require('http-status');
const { ReturnW2M } = require('../../models');
const ApiError = require('../../utils/ApiError');

const createW2MReturnRequest = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'manufacturerEmail' is required");
  }

  const lastRequest = await ReturnW2M.findOne({ manufacturerEmail }).sort({ returnRequestNumber: -1 }).lean();

  let nextNumber = 1;
  if (lastRequest && lastRequest.returnRequestNumber) {
    nextNumber = lastRequest.returnRequestNumber + 1;
  }

  reqBody.returnRequestNumber = nextNumber;

  return ReturnW2M.create(reqBody);
};

const queryW2MReturnRequest = async (filter, options) => {
  return ReturnW2M.paginate(filter, options);
};

const getW2MReturnRequestById = async (id) => {
  return ReturnW2M.findById(id);
};

const updateW2MReturnRequestById = async (id, updateBody) => {
  const data = await getW2MReturnRequestById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }

  Object.assign(data, updateBody);
  await data.save();
  return data;
};

const deleteW2MReturnRequestById = async (id) => {
  const data = await getW2MReturnRequestById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }

  await data.remove();
  return data;
};

module.exports = {
  createW2MReturnRequest,
  queryW2MReturnRequest,
  getW2MReturnRequestById,
  updateW2MReturnRequestById,
  deleteW2MReturnRequestById,
};
