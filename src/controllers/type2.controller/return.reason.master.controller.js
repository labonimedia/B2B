const httpStatus = require('http-status');
const { returnReasonService } = require('../../services');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const arrayUpload = catchAsync(async (req, res) => {
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const result = await returnReasonService.bulkUploadReturnReason(data);
  res.status(httpStatus.CREATED).send({ message: 'Bulk upload completed', result });
});

const queryReturnReason = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['reason']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await returnReasonService.queryReturnReason(filter, options);
  res.send(result);
});

const getReturnReasonById = catchAsync(async (req, res) => {
  const user = await returnReasonService.getReturnReasonById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Care Instruction not found');
  }
  res.send(user);
});

const updateReturnReasonById = catchAsync(async (req, res) => {
  const user = await returnReasonService.updateReturnReasonById(req.params.id, req.body);
  res.send(user);
});

const deleteReturnReasonById = catchAsync(async (req, res) => {
  await returnReasonService.deleteReturnReasonById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  arrayUpload,
  deleteReturnReasonById,
  updateReturnReasonById,
  getReturnReasonById,
  queryReturnReason,
};
