const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { rtoWReturnRequestService } = require('../../services');

const returnRequest = catchAsync(async (req, res) => {
  const data = await rtoWReturnRequestService.createR2WReturnRequest(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const queryR2WReturnRequest = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusAll', 'poId', 'invoiceId', 'wholesalerEmail', 'retailerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await rtoWReturnRequestService.queryR2WReturnRequest(filter, options);
  res.send(result);
});

const getR2WReturnRequestById = catchAsync(async (req, res) => {
  const result = await rtoWReturnRequestService.getR2WReturnRequestById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }
  res.send(result);
});

const updateR2WReturnRequestById = catchAsync(async (req, res) => {
  const result = await rtoWReturnRequestService.updateR2WReturnRequestById(req.params.id, req.body);
  res.send(result);
});

const deleteR2WReturnRequestById = catchAsync(async (req, res) => {
  await rtoWReturnRequestService.deleteR2WReturnRequestById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  returnRequest,
  queryR2WReturnRequest,
  getR2WReturnRequestById,
  updateR2WReturnRequestById,
  deleteR2WReturnRequestById,
};
