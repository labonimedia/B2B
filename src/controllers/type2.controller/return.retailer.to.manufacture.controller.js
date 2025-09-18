const httpStatus = require('http-status');
const { rtoMReturnRequestService } = require('../../services');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const returnRequest = catchAsync(async (req, res) => {
  const data = await rtoMReturnRequestService.createMtoRReturnRequest(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const queryMtoRReturnRequest = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusAll', 'poId', 'invoiceId', 'manufacturerEmail', 'retailerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await rtoMReturnRequestService.queryMtoRReturnRequest(filter, options);
  res.send(result);
});

const getMtoRReturnRequestById = catchAsync(async (req, res) => {
  const result = await rtoMReturnRequestService.getMtoRReturnRequestById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Return Request not found');
  }
  res.send(result);
});

const updateMtoRReturnRequestById = catchAsync(async (req, res) => {
  const result = await rtoMReturnRequestService.updateMtoRReturnRequestById(req.params.id, req.body);
  res.send(result);
});

const deleteMtoRReturnRequestById = catchAsync(async (req, res) => {
  await rtoMReturnRequestService.deleteMtoRReturnRequestById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  deleteMtoRReturnRequestById,
  updateMtoRReturnRequestById,
  getMtoRReturnRequestById,
  queryMtoRReturnRequest,
  returnRequest,
};
