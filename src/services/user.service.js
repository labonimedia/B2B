const httpStatus = require('http-status');
const { User, Wholesaler, Manufacture, Retailer } = require('../models');
const ApiError = require('../utils/ApiError');
const { createManufacture } = require('./manufacture.service');
const { createWholesaler } = require('./wholesaler.service');
const { createRetailer } = require('./retailer.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.role === 'manufacture') {
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      // enum: ['superadmin', 'manufacture', 'wholesaler', 'distributer'],
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
    };
    await createManufacture(data);
  }
  if (userBody.role === 'wholesaler') {
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      // enum: ['superadmin', 'manufacture', 'wholesaler', 'retailer'],
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
    };
    await createWholesaler(data);
  }
  if (userBody.role === 'retailer') {
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      // enum: ['superadmin', 'manufacture', 'wholesaler', 'distributer'],
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
    };
    await createRetailer(data);
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  // Fetch the user and handle if not found
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Initialize profile variable
  let profile;

  // Depending on the user's role, fetch the profile image from the appropriate collection
  switch (user.role) {
    case 'wholesaler':
      const wholesaler = await Wholesaler.findOne({ email: user.email });
      profile = wholesaler ? wholesaler.profileImg : null;
      break;
    case 'manufacturer': // Fixed typo from 'manufacture' to 'manufacturer'
      const manufacturer = await Manufacture.findOne({ email: user.email });
      profile = manufacturer ? manufacturer.profileImg : null;
      break;
    case 'retailer':
      const retailer = await Retailer.findOne({ email: user.email });
      profile = retailer ? retailer.profileImg : null;
      break;
    default:
      profile = null; // Default case if the role does not match any expected values
  }

  // Return the user object with the profile image
  return { ...user.toObject(), profile }; // `user.toObject()` to ensure a plain JavaScript object
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUserByEmail = async (email, updateBody) => {
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
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserByEmail,
  updateUserById,
  deleteUserById,
};
