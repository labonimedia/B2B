const httpStatus = require('http-status');
const { Request, User, Manufacture } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a request
 * @param {Object} requestBody
 * @param {Object} user
 * @returns {Promise<Request>}
 */
const createRequest = async (requestBody, user) => {
  const request = await Request.create(requestBody);
  return request;
};

const createMultipleRequests = async (requestsBody, user) => {
  const requests = await Promise.all(
    requestsBody.map(async (requestBody) => {
      return Request.create(requestBody);
    })
  );
  return requests;
};

// /**
//  * Accept a request
//  * @param {ObjectId} requestId
//  * @param {Object} user
//  * @returns {Promise<Request>}
//  */
// const acceptRequest = async (requestId, user) => {
//   const request = await Request.findById(requestId);
//   if (!request) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
//   }

//   if (request.status !== 'pending') {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Request already accepted');
//   }

//   request.status = 'accepted';
//   await request.save();

//   // You can send notifications to both users here if needed

//   return request;
// };

const acceptRequest = async (requestId, requestByEmail, requestToEmail) => {
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  if (request.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request already accepted');
  }
  const user = await User.findOne({ email: requestByEmail });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const manufacture = await Manufacture.findOne({ email: requestToEmail });
  if (!manufacture) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }
  if (user.refByEmail.includes(requestToEmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already referenced');
  }
  user.refByEmail.push(requestToEmail);
  await user.save();
  request.status = 'accepted';
  await request.save();
  return request;
};

/**
 * Get request by id
 * @param {ObjectId} id
 * @returns {Promise<Request>}
 */
const getRequestById = async (id) => {
  return Request.findById(id);
};

/**
 * Query for requests
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryRequests = async (filter, options) => {
  const requests = await Request.paginate(filter, options);
  return requests;
};

/**
 * Update request by id
 * @param {ObjectId} requestId
 * @param {Object} updateBody
 * @returns {Promise<Request>}
 */
const updateRequestById = async (requestId, updateBody) => {
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  Object.assign(request, updateBody);
  await request.save();
  return request;
};

/**
 * Delete request by id
 * @param {ObjectId} requestId
 * @returns {Promise<Request>}
 */
const deleteRequestById = async (requestId) => {
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  await request.remove();
  return request;
};

module.exports = {
  createRequest,
  acceptRequest,
  getRequestById,
  queryRequests,
  updateRequestById,
  deleteRequestById,
  createMultipleRequests
};