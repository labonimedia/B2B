const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { requestService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createRequest = catchAsync(async (req, res) => {
  const result = await requestService.createRequest(req.body, req.user);
  if (result.message) {
    return res.status(httpStatus.OK).send(result);
  }
  return res.status(httpStatus.CREATED).send(result);
});

const createMultipleRequests = catchAsync(async (req, res) => {
  const requests = await requestService.createMultipleRequests(req.body.requests, req.user);
  res.status(httpStatus.CREATED).send(requests);
});

const filterRequests = catchAsync(async (req, res) => {
  const { status, email, requestByEmail } = req.query;

  if (!status) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Status is required');
  }

  const filter = { status };

  if (email) {
    filter.email = email;
  } else if (requestByEmail) {
    filter.requestByEmail = requestByEmail;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either email or requestByEmail is required');
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await requestService.queryRequests(filter, options);
  res.send(result);
});

const acceptRequest = catchAsync(async (req, res) => {
  const { id, requestbyemail, requesttoemail } = req.params;
  const { status } = req.body;
  const request = await requestService.acceptRequest(id, requestbyemail, requesttoemail, status);
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
  //   const filter = pick(req.query, ['status', 'requestByCompanyName', 'email','requestByFullName','requestByEmail','']);
  const filter = pick(req.query, [
    'fullName',
    'companyName',
    'email',
    'code',
    'mobileNumber',
    'status',
    'requestByFullName',
    'requestByCompanyName',
    'requestByEmail',
    'requestByCountry',
    'requestByCity',
    'requestByState',
    'requestByMobileNumber',
    'requestByRole',
    'role',
    'state',
    'city',
    'country',
  ]);

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

const getRequestStatus = catchAsync(async (req, res) => {
  console.log(req.query);
  const request = await requestService.getRequestStatus(req.query.wholsalerEmail, req.query.requestByEmail);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  res.send(request);
});

module.exports = {
  createRequest,
  acceptRequest,
  getRequestById,
  getRequestStatus,
  queryRequests,
  updateRequestById,
  deleteRequestById,
  createMultipleRequests,
  filterRequests,
};
