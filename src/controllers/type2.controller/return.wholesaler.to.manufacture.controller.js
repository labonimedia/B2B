const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { wToMReturnRequestService } = require('../../services');

const returnRequest = catchAsync(async (req, res) => {
  const data = await wToMReturnRequestService.createW2MReturnRequest(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const queryReturnRequest = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusAll', 'poId', 'invoiceId', 'manufacturerEmail', 'wholesalerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wToMReturnRequestService.queryW2MReturnRequest(filter, options);
  res.send(result);
});

const getReturnRequestById = catchAsync(async (req, res) => {
  const result = await wToMReturnRequestService.getW2MReturnRequestById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }
  res.send(result);
});

const updateReturnRequestById = catchAsync(async (req, res) => {
  const result = await wToMReturnRequestService.updateW2MReturnRequestById(req.params.id, req.body);
  res.send(result);
});

const deleteReturnRequestById = catchAsync(async (req, res) => {
  await wToMReturnRequestService.deleteW2MReturnRequestById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  returnRequest,
  queryReturnRequest,
  getReturnRequestById,
  updateReturnRequestById,
  deleteReturnRequestById,
};
