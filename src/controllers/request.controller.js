const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { requestService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createRequest = catchAsync(async (req, res) => {
  const request = await requestService.createRequest(req.body, req.user);
  res.status(httpStatus.CREATED).send(request);
});

const acceptRequest = catchAsync(async (req, res) => {
  const request = await requestService.acceptRequest(req.params.id, req.user);
  res.status(httpStatus.OK).send(request);
});

const getRequestById = catchAsync(async (req, res) => {
  const request = await requestService.getRequestById(req.params.id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  res.send(request);
});

const queryRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'requestBy', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await requestService.queryRequests(filter, options);
  res.send(result);
});

const updateRequestById = catchAsync(async (req, res) => {
  const request = await requestService.updateRequestById(req.params.id, req.body);
  res.send(request);
});

const deleteRequestById = catchAsync(async (req, res) => {
  await requestService.deleteRequestById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRequest,
  acceptRequest,
  getRequestById,
  queryRequests,
  updateRequestById,
  deleteRequestById,
};
