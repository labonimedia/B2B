const httpStatus = require('http-status');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Wholesaler, Manufacture, Retailer, Counter, Invitation } = require('../models');
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
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start transaction

  try {
    // Check if the email is already taken
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    // Generate unique ID based on the user's role
    let prefix;
    if (userBody.role === 'manufacture') {
      prefix = 'MAN';
    } else if (userBody.role === 'wholesaler') {
      prefix = 'WHO';
    } else if (userBody.role === 'retailer') {
      prefix = 'RET';
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
    }

    // Increment the sequence for the corresponding role
    const counter = await Counter.findOneAndUpdate(
      { role: userBody.role },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    // Assign the generated user code
    userBody.code = `${prefix}${String(counter.seq).padStart(4, '0')}`;

    // Create the user in the User collection
    const createdUser = await User.create([userBody], { session });

    // Create additional data based on role
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
      userCode: userBody.code,
      contryCode: userBody.contryCode,
    };

    if (userBody.role === 'manufacture') {
      await createManufacture([data], { session });
    } else if (userBody.role === 'wholesaler') {
      await createWholesaler([data], { session });
    } else if (userBody.role === 'retailer') {
      await createRetailer([data], { session });
    }

    // Update invitation status
    await Invitation.findOneAndUpdate(
      { email: createdUser[0].email },
      { $set: { status: 'accepted' } },
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return createdUser[0];
  } catch (error) {
    await session.abortTransaction(); // Rollback if anything fails
    session.endSession();
    throw error;
  }
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
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  let profile;
  switch (user.role) {
    case 'wholesaler': {
      const wholesaler = await Wholesaler.findOne({ email: user.email });
      profile = wholesaler ? wholesaler.profileImg : null;
      break;
    }
    case 'manufacture': {
      const manufacturer = await Manufacture.findOne({ email: user.email });
      profile = manufacturer ? manufacturer.profileImg : null;
      break;
    }
    case 'retailer': {
      const retailer = await Retailer.findOne({ email: user.email });
      profile = retailer ? retailer.profileImg : null;
      break;
    }
    default: {
      profile = null;
      break;
    }
  }

  return { ...user.toObject(), profile };
};
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  // Check if the email is already taken
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.password) {
    // Hash the new password before updating
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }

  // Update the user document directly in the database
  const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Fetch the user's profile image based on the role
  let profile;
  switch (user.role) {
    case 'wholesaler': {
      const wholesaler = await Wholesaler.findOne({ email: user.email });
      profile = wholesaler ? wholesaler.profileImg : null;
      break;
    }
    case 'manufacture': {
      const manufacturer = await Manufacture.findOne({ email: user.email });
      profile = manufacturer ? manufacturer.profileImg : null;
      break;
    }
    case 'retailer': {
      const retailer = await Retailer.findOne({ email: user.email });
      profile = retailer ? retailer.profileImg : null;
      break;
    }
    default: {
      profile = null;
      break;
    }
  }

  // Combine the updated user object with the profile image
  return { ...user.toObject(), profile };
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

const deleteUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { role } = user;

  // Delete user from the User collection
  await User.deleteOne({ email });

  // Delete user from the respective role-based collection
  switch (role) {
    case 'wholesaler':
      await Wholesaler.deleteOne({ email });
      break;
    case 'manufacture':
      await Manufacture.deleteOne({ email });
      break;
    case 'retailer':
      await Retailer.deleteOne({ email });
      break;
    default:
      break;
  }

  return { message: 'User deleted successfully' };
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserByEmail,
  updateUserById,
  deleteUserById,
  deleteUserByEmail,
};
