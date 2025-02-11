const httpStatus = require('http-status');
const { Retailer, User } = require('../models');
const ApiError = require('../utils/ApiError');

const fileupload = async (req, id) => {
  // Find the document by ID
  const retailer = await Retailer.findById(id);

  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }

  // const extractPath = (url) => new URL(url).pathname;
  if (req.body.file) {
    retailer.file = req.body.file ? req.body.file[0] : null;
  }
  if (req.body.profileImg) {
    // const profileImg = req.body.profileImg ? extractPath(req.body.profileImg[0]) : null;
    retailer.profileImg = req.body.profileImg ? req.body.profileImg[0] : null;
  }
  if (req.body.fileName) {
    const fileName = req.body.fileName || '';
    retailer.fileName = fileName;
  }
  await retailer.save();
  return retailer;
};
/**
 * Create a Retailer
 * @param {Object} reqBody
 * @returns {Promise<Retailer>}
 */
const createRetailer = async (reqBody) => {
  if (reqBody.GSTIN) {
    if (await Retailer.findOne({ GSTIN: req.body.GSTIN })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'GSTIN already exists');
    }
  }

  return Retailer.create(reqBody);
};

/**
 * Query for Retailer
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRetailer = async (filter, options) => {
  const Retailers = await Retailer.paginate(filter, options);
  return Retailers;
};

/**
 * Get Retailer by id
 * @param {ObjectId} id
 * @returns {Promise<Retailer>}
 */
const getRetailerById = async (id) => {
  return Retailer.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Retailer>}
 */
const getUserByEmail = async (email) => {
  return Retailer.findOne({ email });
};

/**
 * Update Retailer by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Retailer>}
 */
// const updateRetailerById = async (email, updateBody) => {
//   const user = await getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

const updateRetailerById = async (email, updateBody) => {
  // Get the Retailer document by email
  const retailer = await Retailer.findOne({ email });
  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }

  // Get the corresponding User document by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Define field mapping between Retailer and User models
  const fieldMap = {
    fullName: 'fullName',
    companyName: 'companyName',
    email: 'email',
    mobNumber: 'mobileNumber',
    // Add other common fields as needed
  };

  // Prepare user update body
  const userUpdateBody = {};
  Object.keys(updateBody).forEach((key) => {
    const userField = fieldMap[key];
    if (userField) {
      userUpdateBody[userField] = updateBody[key];
    }
  });

  // Handle email uniqueness check
  if (userUpdateBody.email) {
    const isEmailTaken = await User.isEmailTaken(userUpdateBody.email, user._id);
    if (isEmailTaken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  // Update User document if there are changes
  if (Object.keys(userUpdateBody).length > 0) {
    Object.assign(user, userUpdateBody);
    await user.save();
  }

  // Update Retailer document
  Object.assign(retailer, updateBody);
  await retailer.save();

  return retailer;
};
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Retailer>}
 */
const deleteRetailerById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  await user.remove();
  return user;
};

/**
 * Get user by ID
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get wholesalers by emails with pagination
 * @param {Array<string>} emails - Array of wholesaler emails
 * @param {Object} options - Pagination options (limit, page)
 * @returns {Promise<QueryResult>}
 */
const getWholesalersByEmails = async (emails, options, userCategory) => {
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const page = options.page ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  // Query to find wholesalers by emails
  const query = { email: { $in: emails }, role: 'wholesaler' };
  if (userCategory) {
    query.userCategory = userCategory;
  }
  const totalDocs = await User.countDocuments(query);
  const docs = await User.find(query).skip(skip).limit(limit);

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages: Math.ceil(totalDocs / limit),
  };
};
/**
 * Get wholesalers by emails with pagination
 * @param {Array<string>} emails - Array of wholesaler emails
 * @param {Object} options - Pagination options (limit, page)
 * @returns {Promise<QueryResult>}
 */
const getManufacturerByEmails = async (emails, options, userCategory) => {
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const page = options.page ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  // Query to find wholesalers by emails
  const query = { email: { $in: emails }, role: 'manufacture' };
  if (userCategory) {
    query.userCategory = userCategory;
  }
  const totalDocs = await User.countDocuments(query);
  const docs = await User.find(query).skip(skip).limit(limit);

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages: Math.ceil(totalDocs / limit),
  };
};
module.exports = {
  createRetailer,
  queryRetailer,
  getRetailerById,
  fileupload,
  getUserByEmail,
  updateRetailerById,
  deleteRetailerById,
  getUserById,
  getWholesalersByEmails,
  getManufacturerByEmails,
};
