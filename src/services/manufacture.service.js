const httpStatus = require('http-status');
const { Manufacture, User, Wholesaler, Retailer } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a manufacture
 * @param {Object} reqBody
 * @returns {Promise<Manufacture>}
 */
const createManufacture = async (reqBody) => {
  return Manufacture.create(reqBody);
};

const fileupload = async (req, id) => {
  // Find the document by ID
  const manufacture = await Manufacture.findById(id);

  if (!manufacture) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }

  const extractPath = (url) => new URL(url).pathname;
  if (req.body.file) {
    const file = req.body.file ? extractPath(req.body.file[0]) : null;
    manufacture.file = file;
  }
  if (req.body.profileImg) {
    const profileImg = req.body.profileImg ? extractPath(req.body.profileImg[0]) : null;
    manufacture.profileImg = profileImg;
  }
  if (req.body.fileName) {
    const fileName = req.body.fileName || '';
    manufacture.fileName = fileName;
  }

  await manufacture.save();
  return manufacture;
};

/**
 * Query for manufacture
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryManufacture = async (filter, options) => {
  const manufacture = await Manufacture.paginate(filter, options);
  return manufacture;
};

/**
 * Get manufacture by id
 * @param {ObjectId} id
 * @returns {Promise<Manufacture>}
 */
const getManufactureById = async (id) => {
  return Manufacture.findById(id);
};

/**
 * Get manufacture by id
 * @param {variable} refByEmail
 * @returns {Promise<Manufacture>}
 */

const getManufactureByEmail = async (refByEmail, searchKeywords = '', options = {}) => {
  // Step 1: Find users with the specified email in their refByEmail field
  const users = await User.find({ refByEmail });
  if (!users || users.length === 0) {
    throw new Error('No users found with the specified refByEmail');
  }
  // Step 2: Extract the emails of the referred users
  const referredEmails = users.map((user) => user.email);
  if (referredEmails.length === 0) {
    throw new Error('No referred emails found');
  }
  const searchRegex = new RegExp(searchKeywords, 'i');
  // Step 3: Create a filter for the Manufacture records
  const manufactureFilter = {
    email: { $in: referredEmails },
    $or: [
      { fullName: { $regex: searchRegex } },
      { companyName: { $regex: searchRegex } },
      { country: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
    ],
  };
  const manufactures = await Wholesaler.paginate(manufactureFilter, options);
  return manufactures;
};

/**
 * Get manufacture by id
 * @param {variable} refByEmail
 * @returns {Promise<Manufacture>}
 */

const getRetailersByEmail = async (refByEmail, searchKeywords = '', options = {}) => {
  // Step 1: Find users with the specified email in their refByEmail field
  const users = await User.find({ refByEmail });
  if (!users || users.length === 0) {
    throw new Error('No users found with the specified refByEmail');
  }
  // Step 2: Extract the emails of the referred users
  const referredEmails = users.map((user) => user.email);
  if (referredEmails.length === 0) {
    throw new Error('No referred emails found');
  }
  const searchRegex = new RegExp(searchKeywords, 'i');
  // Step 3: Create a filter for the Manufacture records
  const manufactureFilter = {
    email: { $in: referredEmails },
    $or: [
      { fullName: { $regex: searchRegex } },
      { companyName: { $regex: searchRegex } },
      { country: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
    ],
  };
  const manufactures = await Retailer.paginate(manufactureFilter, options);
  return manufactures;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Manufacture>}
 */
const getUserByEmail = async (email) => {
  return Manufacture.findOne({ email });
};

/**
 * Update manufacture by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Manufacture>}
 */
const updateManufactureById = async (email, updateBody) => {
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
 * @returns {Promise<Manufacture>}
 */
const deleteManufactureById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createManufacture,
  queryManufacture,
  getManufactureById,
  getManufactureByEmail,
  getUserByEmail,
  fileupload,
  updateManufactureById,
  deleteManufactureById,
  getRetailersByEmail,
};
