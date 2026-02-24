const httpStatus = require('http-status');
const { ReturnR2W } = require('../../models');
const ApiError = require('../../utils/ApiError');

const createR2WReturnRequest = async (reqBody) => {
  const { wholesalerEmail } = reqBody;

  if (!wholesalerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "'wholesalerEmail' is required to generate return request number."
    );
  }

  const lastRequest = await ReturnR2W.findOne({ wholesalerEmail })
    .sort({ returnRequestNumber: -1 })
    .lean();

  let nextNumber = 1;
  if (lastRequest?.returnRequestNumber) {
    nextNumber = lastRequest.returnRequestNumber + 1;
  }

  reqBody.returnRequestNumber = nextNumber;

  return ReturnR2W.create(reqBody);
};

const queryR2WReturnRequest = async (filter, options) => {
  return ReturnR2W.paginate(filter, options);
};

const getR2WReturnRequestById = async (id) => {
  return ReturnR2W.findById(id);
};

const updateR2WReturnRequestById = async (id, updateBody) => {
  const data = await getR2WReturnRequestById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }
  Object.assign(data, updateBody);
  await data.save();
  return data;
};

const deleteR2WReturnRequestById = async (id) => {
  const data = await getR2WReturnRequestById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }
  await data.remove();
  return data;
};

module.exports = {
  createR2WReturnRequest,
  queryR2WReturnRequest,
  getR2WReturnRequestById,
  updateR2WReturnRequestById,
  deleteR2WReturnRequestById,
};
