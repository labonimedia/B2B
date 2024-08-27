const httpStatus = require('http-status');
const { Wholesaler, User, Retailer } = require('../models');
const ApiError = require('../utils/ApiError');



const fileupload = async (req, id) => {
  // Find the document by ID
  const wholesaler = await Wholesaler.findById(id);

  if (!wholesaler) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  }
 
  const extractPath = (url) => new URL(url).pathname;
  const file = req.body.file ? extractPath(req.body.file[0]) : null;
  const fileName = req.body.fileName || '';

  wholesaler.file = file;
  wholesaler.fileName = fileName;

  await wholesaler.save();
  return wholesaler;
};
/**
 * Create a Wholesaler
 * @param {Object} reqBody
 * @returns {Promise<Wholesaler>}
 */
const createWholesaler = async (reqBody) => {
  return Wholesaler.create(reqBody);
};

/**
 * Query for Wholesaler
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWholesaler = async (filter, options) => {
  const wholesalers = await Wholesaler.paginate(filter, options);
  return wholesalers;
};

/**
 * Get Wholesaler by id
 * @param {ObjectId} id
 * @returns {Promise<Wholesaler>}
 */
const getWholesalerById = async (id) => {
  return Wholesaler.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Wholesaler>}
 */
const getUserByEmail = async (email) => {
  return Wholesaler.findOne({ email });
};

/**
 * Update Wholesaler by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Wholesaler>}
 */
const updateWholesalerById = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Wholesaler>}
 */
const deleteWholesalerById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
/**
 * Get user by email
 * @param {ObjectId} email
 * @returns {Promise<User>}
 */

const getUser = async (email) => {
  return User.findOne({ email });
};
// /**
//  * Get users by email
//  * @param {ObjectId} email
//  * @returns {Promise<User>}
//  */
// const getUsersByEmails = async (emails) => {
//   return User.find({ email: { $in: emails } });
// };

/**
 * Get users by emails with pagination
 * @param {Array<string>} emails
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page
 * @param {number} [options.page] - Current page
 * @returns {Promise<QueryResult>}
 */
const getUsersByEmails = async (emails, options) => {
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const page = options.page ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;
  const query = { email: { $in: emails } };

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

const getRetailerByEmail = async (refByEmail, searchKeywords = '', options = {}) => {
  const users = await User.find({ refByEmail });
  if (!users || users.length === 0) {
    throw new Error('No users found with the specified refByEmail');
  }
  
  // Step 2: Extract the emails of the referred users
  const referredEmails = users.map(user => user.email);
  if (referredEmails.length === 0) {
    throw new Error('No referred emails found');
  }

  const searchRegex = new RegExp(searchKeywords, 'i');

  const manufactureFilter = {
    email: { $in: referredEmails },
    $or: [
      { fullName: { $regex: searchRegex } },
      { companyName: { $regex: searchRegex } },
      { country: { $regex: searchRegex } },
      { city: { $regex: searchRegex } }
    ]
  };

  // Use pagination options if provided
  const manufactures = await Retailer.paginate(manufactureFilter, options);
  return manufactures;
};

// const getRetailerByEmail = async (refByEmail, filter = {}, options = {}) => {
//   // Step 1: Find users with the specified email in their refByEmail field
//   const users = await User.find({ refByEmail });
//   if (!users || users.length === 0) {
//     throw new Error('No users found with the specified refByEmail');
//   }
//   // Step 2: Extract the emails of the referred users
//   const referredEmails = users.map(user => user.email);
//   if (referredEmails.length === 0) {
//     throw new Error('No referred emails found');
//   }
//   // Step 3: Create a filter for the Manufacture records
//   const manufactureFilter = {
//     email: { $in: referredEmails },
//     ...filter,
//   };
//   const manufactures = await Retailer.paginate(manufactureFilter, options);
//   return manufactures;
// };
module.exports = {
  createWholesaler,
  queryWholesaler,
  getWholesalerById,
  getUserByEmail,
  getRetailerByEmail,
  updateWholesalerById,
  deleteWholesalerById,
  getUser,
  fileupload,
  getUsersByEmails,
};
