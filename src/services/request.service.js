const httpStatus = require('http-status');
const { Request, User, Manufacture, Wholesaler, ChannelPartner } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a request
 * @param {Object} requestBody
 * @param {Object} user
 * @returns {Promise<Request>}
 */
const createRequest = async (requestBody) => {
  // Check if a request with the same requestor and recipient already exists
  const existingRequest = await Request.findOne({
    requestByEmail: requestBody.requestByEmail,
    email: requestBody.email,
  });

  if (existingRequest) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `A request with status '${existingRequest.status}' already exists between ${requestBody.requestByEmail} and ${requestBody.email}`
    );
  }

  // Create a new request if no existing request is found
  const request = await Request.create(requestBody);
  return request;
};

const createMultipleRequests = async (requestsBody) => {
  const requests = await Promise.all(
    requestsBody.map(async (requestBody) => {
      return Request.create(requestBody);
    })
  );
  return requests;
};

// const acceptRequest = async (requestId, requestByEmail, requestToEmail, status) => {
//   const request = await Request.findById(requestId);
//   if (!request) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
//   }

//   if (status === 'rejected') {
//     request.status = 'rejected';
//     await request.save();
//     return request;
//   }

//   if (status === 'accepted') {
//     const user = await User.findOne({ email: requestByEmail });
//     if (!user) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // Find either a Manufacture or a Wholesaler by email
//     const manufacture = await Manufacture.findOne({ email: requestToEmail });
//     const wholesaler = await Wholesaler.findOne({ email: requestToEmail });

//     // Check if Manufacture or Wholesaler exists
//     if (!manufacture && !wholesaler) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture or Wholesaler not found');
//     }

//     // Check if the email is already referenced in refByEmail
//     if (!user.refByEmail.includes(requestToEmail)) {
//       user.refByEmail.push(requestToEmail);
//       await user.save();
//     }

//     // Update the request status to accepted
//     request.status = 'accepted';
//     await request.save();
//   }

//   return request;
// };
const acceptRequest = async (requestId, requestByEmail, requestToEmail, status) => {
  const request = await Request.findById(requestId);

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  // ❌ REJECT
  if (status === 'rejected') {
    request.status = 'rejected';
    await request.save();
    return request;
  }

  // ✅ ACCEPT
  if (status === 'accepted') {
    // 🔹 Sender
    const sender = await User.findOne({ email: requestByEmail });
    if (!sender) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sender user not found');
    }

    // 🔹 Receiver (ALL MODULES)
    let receiver =
      (await User.findOne({ email: requestToEmail })) ||
      (await Manufacture.findOne({ email: requestToEmail })) ||
      (await Wholesaler.findOne({ email: requestToEmail })) ||
      (await ChannelPartner.findOne({ email: requestToEmail }));

    if (!receiver) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Receiver not found');
    }

    // 🔹 Existing logic (DO NOT TOUCH)
    if (!sender.refByEmail.includes(requestToEmail)) {
      sender.refByEmail.push(requestToEmail);
      await sender.save();
    }

    if (receiver.refByEmail && Array.isArray(receiver.refByEmail)) {
      if (!receiver.refByEmail.includes(requestByEmail)) {
        receiver.refByEmail.push(requestByEmail);
        await receiver.save();
      }
    }

    // 🔥🔥 NEW LOGIC START (CP ↔ MANUFACTURER LINKING)

    // Case 1: Sender is Channel Partner → Receiver is Manufacturer
    const senderCP = await ChannelPartner.findOne({ email: requestByEmail });
    const receiverManufacturer = await Manufacture.findOne({ email: requestToEmail });

    if (senderCP && receiverManufacturer) {
      const alreadyLinked = senderCP.linkedManufacturers.find(
        (m) => m.manufacturerEmail === requestToEmail
      );

      if (!alreadyLinked) {
        senderCP.linkedManufacturers.push({
          manufacturerEmail: requestToEmail,
          manufacturerName: receiverManufacturer.companyName || receiverManufacturer.fullName,
          isApproved: true,
        });

        await senderCP.save();
      }
    }

    // Case 2: Sender is Manufacturer → Receiver is Channel Partner
    const receiverCP = await ChannelPartner.findOne({ email: requestToEmail });
    const senderManufacturer = await Manufacture.findOne({ email: requestByEmail });

    if (receiverCP && senderManufacturer) {
      const alreadyLinked = receiverCP.linkedManufacturers.find(
        (m) => m.manufacturerEmail === requestByEmail
      );

      if (!alreadyLinked) {
        receiverCP.linkedManufacturers.push({
          manufacturerEmail: requestByEmail,
          manufacturerName: senderManufacturer.companyName || senderManufacturer.fullName,
          isApproved: true,
        });

        await receiverCP.save();
      }
    }

    // 🔥🔥 NEW LOGIC END

    // 🔹 Update request
    request.status = 'accepted';
    await request.save();
  }

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
 * Get request by id
 * @param {ObjectId} id
 * @returns {Promise<Request>}
 */
const getRequestStatus = async (email, requestByEmail) => {
  return Request.findOne({ email, requestByEmail });
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
  getRequestStatus,
  getRequestById,
  queryRequests,
  updateRequestById,
  deleteRequestById,
  createMultipleRequests,
};
