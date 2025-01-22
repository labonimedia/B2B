const httpStatus = require('http-status');
const { Wholesaler, User, Retailer } = require('../models');
const ApiError = require('../utils/ApiError');

const fileupload = async (req, id) => {
  // Find the document by ID
  const wholesaler = await Wholesaler.findById(id);

  if (!wholesaler) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  }

  // const extractPath = (url) => new URL(url).pathname;
  if (req.body.file) {
    wholesaler.file = req.body.file ? req.body.file[0] : null
  }
  if (req.body.profileImg) {
    // const profileImg = req.body.profileImg ? extractPath(req.body.profileImg[0]) : null;
    wholesaler.profileImg = req.body.profileImg ? req.body.profileImg[0] : null;
  }
  if (req.body.fileName) {
    const fileName = req.body.fileName || '';
    wholesaler.fileName = fileName;
  }

  await wholesaler.save();
  return wholesaler;
};
/**
 * Create a Wholesaler
 * @param {Object} reqBody
 * @returns {Promise<Wholesaler>}
 */
const createWholesaler = async (reqBody) => {
  if (reqBody.GSTIN) {
    if (await Wholesaler.findOne({ GSTIN: reqBody.GSTIN })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'GSTIN already exists');
    }
  }
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

// // Utility function to escape special characters in the search keywords
// const escapeRegExp = (string) => {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
// };

// const getSearchWholesaler = async (searchKeywords = '', options = {}) => {
//   const sanitizedKeywords = escapeRegExp(searchKeywords); // Sanitize input
//   // eslint-disable-next-line security/detect-non-literal-regexp
//   const searchRegex = new RegExp(sanitizedKeywords, 'i');

//   const wholesalerFilter = {
//     $or: [
//       { address: { $regex: searchRegex } },
//       { fullName: { $regex: searchRegex } },
//       { companyName: { $regex: searchRegex } },
//       { country: { $regex: searchRegex } },
//       { city: { $regex: searchRegex } },
//     ],
//   };

//   const wholesalers = await Wholesaler.paginate(wholesalerFilter, options);
//   return wholesalers;
// };
// Utility function to escape special characters in the search keywords
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
};

const getSearchWholesaler = async (searchKeywords = '', options = {}) => {
  // Sanitize and normalize input to avoid case and special character issues
  const sanitizedKeywords = escapeRegExp(searchKeywords.trim()); // Trim and sanitize input

  // eslint-disable-next-line security/detect-non-literal-regexp
  const searchRegex = new RegExp(sanitizedKeywords, 'i'); // Case-insensitive search

  const wholesalerFilter = {
    $or: [
      { address: { $regex: searchRegex } },
      { fullName: { $regex: searchRegex } },
      { companyName: { $regex: searchRegex } },
      { country: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
    ],
  };

  const wholesalers = await Wholesaler.paginate(wholesalerFilter, options);
  return wholesalers;
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
//  * Get users by emails with pagination
//  * @param {Array<string>} emails
//  * @param {Object} options - Query options
//  * @param {number} [options.limit] - Maximum number of results per page
//  * @param {number} [options.page] - Current page
//  * @returns {Promise<QueryResult>}
//  */
// const getUsersByEmails = async (emails, options) => {
//   const limit = options.limit ? parseInt(options.limit, 10) : 10;
//   const page = options.page ? parseInt(options.page, 10) : 1;
//   const skip = (page - 1) * limit;
//   const query = { email: { $in: emails } };

//   const totalDocs = await User.countDocuments(query);
//   const docs = await User.find(query).skip(skip).limit(limit);

//   return {
//     docs,
//     totalDocs,
//     limit,
//     page,
//     totalPages: Math.ceil(totalDocs / limit),
//   };
// };
/**
 * Get users by emails with pagination and optional userCategory filter
 * @param {Array<string>} emails
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page
 * @param {number} [options.page] - Current page
 * @param {string} [userCategory] - Optional userCategory filter
 * @returns {Promise<QueryResult>}
 */
const getUsersByEmails = async (emails, options, userCategory) => {
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const page = options.page ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  // Create query object
  const query = { email: { $in: emails } };

  // If userCategory is provided, add it to the query
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

const getRetailerByEmail = async (refByEmail, searchKeywords = '', options = {}) => {
  const sanitizedKeywords = escapeRegExp(searchKeywords); // Sanitize input
  // eslint-disable-next-line security/detect-non-literal-regexp
  const searchRegex = new RegExp(sanitizedKeywords, 'i');

  const users = await User.find({ refByEmail });
  if (!users || users.length === 0) {
    throw new Error('No users found with the specified refByEmail');
  }

  const referredEmails = users.map((user) => user.email);
  if (referredEmails.length === 0) {
    throw new Error('No referred emails found');
  }

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

const assignOrUpdateDiscount = async (email, discountGivenBy, category, productDiscount, shippingDiscount) => {
  const wholesaler = await Wholesaler.findOne({ email });
  if (!wholesaler) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  }

  const existingDiscountIndex = wholesaler.discountGiven.findIndex(
    (discount) => discount.discountGivenBy === discountGivenBy
  );

  if (existingDiscountIndex !== -1) {
    // Update the existing discount
    wholesaler.discountGiven[existingDiscountIndex].category = category;
    wholesaler.discountGiven[existingDiscountIndex].productDiscount = productDiscount;
    wholesaler.discountGiven[existingDiscountIndex].shippingDiscount = shippingDiscount;
  } else {
    // Add new discount entry
    wholesaler.discountGiven.push({ discountGivenBy, category, productDiscount, shippingDiscount });
  }

  await wholesaler.save();
  return wholesaler;
};

const assignOrUpdateDiscountToRetailer = async (email, discountGivenBy, category, productDiscount, shippingDiscount) => {
  const wholesaler = await Retailer.findOne({ email });
  if (!wholesaler) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }

  const existingDiscountIndex = wholesaler.discountGiven.findIndex(
    (discount) => discount.discountGivenBy === discountGivenBy
  );

  if (existingDiscountIndex !== -1) {
    // Update the existing discount
    wholesaler.discountGiven[existingDiscountIndex].category = category;
    wholesaler.discountGiven[existingDiscountIndex].productDiscount = productDiscount;
    wholesaler.discountGiven[existingDiscountIndex].shippingDiscount = shippingDiscount;
  } else {
    // Add new discount entry
    wholesaler.discountGiven.push({ discountGivenBy, category, productDiscount, shippingDiscount });
  }

  await wholesaler.save();
  return wholesaler;
};

const getDiscountByGivenBy = async (wholesalerId, discountGivenBy) => {
  const wholesaler = await Wholesaler.findById(wholesalerId);
  if (!wholesaler) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  }
  const foundDiscount = wholesaler.discountGiven.find((d) => d.discountGivenBy === discountGivenBy);

  if (!foundDiscount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
  }

  return foundDiscount;
};

const getDiscountByGivenByToRetailer = async (retailerId, discountGivenBy) => {
  const wholesaler = await Retailer.findById(retailerId);
  if (!wholesaler) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  const foundDiscount = wholesaler.discountGiven.find((d) => d.discountGivenBy === discountGivenBy);

  if (!foundDiscount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
  }

  return foundDiscount;
};

module.exports = {
  createWholesaler,
  queryWholesaler,
  getWholesalerById,
  getUserByEmail,
  getRetailerByEmail,
  updateWholesalerById,
  deleteWholesalerById,
  getUser,
  getSearchWholesaler,
  fileupload,
  getUsersByEmails,
  assignOrUpdateDiscount,
  getDiscountByGivenBy,
  assignOrUpdateDiscountToRetailer,
  getDiscountByGivenByToRetailer,
};
