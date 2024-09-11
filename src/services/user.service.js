const httpStatus = require('http-status');
const { User, Wholesaler, Manufacture, Retailer, Counter } = require('../models');
const ApiError = require('../utils/ApiError');
const { createManufacture } = require('./manufacture.service');
const { createWholesaler } = require('./wholesaler.service');
const { createRetailer } = require('./retailer.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
// const createUser = async (userBody) => {
//   if (await User.isEmailTaken(userBody.email)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   if (userBody.role === 'manufacture') {
//     const data = {
//       fullName: userBody.fullName,
//       companyName: userBody.companyName,
//       email: userBody.email,
//       // enum: ['superadmin', 'manufacture', 'wholesaler', 'distributer'],
//       mobNumber: userBody.mobileNumber,
//       category: userBody.category,
//     };
//     await createManufacture(data);
//   }
//   if (userBody.role === 'wholesaler') {
//     const data = {
//       fullName: userBody.fullName,
//       companyName: userBody.companyName,
//       email: userBody.email,
//       // enum: ['superadmin', 'manufacture', 'wholesaler', 'retailer'],
//       mobNumber: userBody.mobileNumber,
//       category: userBody.category,
//     };
//     await createWholesaler(data);
//   }
//   if (userBody.role === 'retailer') {
//     const data = {
//       fullName: userBody.fullName,
//       companyName: userBody.companyName,
//       email: userBody.email,
//       // enum: ['superadmin', 'manufacture', 'wholesaler', 'distributer'],
//       mobNumber: userBody.mobileNumber,
//       category: userBody.category,
//     };
//     await createRetailer(data);
//   }
//   return User.create(userBody);
// };

const createUser = async (userBody) => {
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
  }

  // Increment the sequence for the corresponding role
  const counter = await Counter.findOneAndUpdate({ role: userBody.role }, { $inc: { seq: 1 } }, { new: true, upsert: true });

  // Assign the generated code to the userBody
  // eslint-disable-next-line no-param-reassign
  userBody.code = `${prefix}${String(counter.seq).padStart(4, '0')}`;

  // Create additional data based on role and create corresponding record
  if (userBody.role === 'manufacture') {
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
      code: userBody.code, // Pass the generated code
    };
    await createManufacture(data);
  } else if (userBody.role === 'wholesaler') {
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
      code: userBody.code, // Pass the generated code
    };
    await createWholesaler(data);
  } else if (userBody.role === 'retailer') {
    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
      code: userBody.code, // Pass the generated code
    };
    await createRetailer(data);
  }

  // Finally, create the user in the User collection
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

// /**
//  * Get user by id
//  * @param {ObjectId} id
//  * @returns {Promise<User>}
//  */
// const getUserById = async (id) => {
//   const user = await User.findById(id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   let profile;
//   switch (user.role) {
//     // eslint-disable-next-line no-case-declarations
//     case 'wholesaler':
//       const wholesaler = await Wholesaler.findOne({ email: user.email });
//       profile = wholesaler ? wholesaler.profileImg : null;
//       break;
//     // eslint-disable-next-line no-case-declarations
//     case 'manufacture':
//       const manufacturer = await Manufacture.findOne({ email: user.email });
//       profile = manufacturer ? manufacturer.profileImg : null;
//       break;
//     // eslint-disable-next-line no-case-declarations
//     case 'retailer':
//       const retailer = await Retailer.findOne({ email: user.email });
//       profile = retailer ? retailer.profileImg : null;
//       break;
//     default:
//       profile = null;
//   }

//   return { ...user.toObject(), profile };
// };
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

// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async (userId, updateBody) => {
//   // Check if the email is already taken
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }

//   // Update the user document directly in the database
//   const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Fetch the user's profile image based on the role
//   let profile;
//   switch (user.role) {
//     // eslint-disable-next-line no-case-declarations
//     case 'wholesaler':
//       const wholesaler = await Wholesaler.findOne({ email: user.email });
//       profile = wholesaler ? wholesaler.profileImg : null;
//       break;
//     // eslint-disable-next-line no-case-declarations
//     case 'manufacture':
//       const manufacturer = await Manufacture.findOne({ email: user.email });
//       profile = manufacturer ? manufacturer.profileImg : null;
//       break;
//     // eslint-disable-next-line no-case-declarations
//     case 'retailer':
//       const retailer = await Retailer.findOne({ email: user.email });
//       profile = retailer ? retailer.profileImg : null;
//       break;
//     // eslint-disable-next-line no-case-declarations
//     default:
//       profile = null;
//   }

//   // Combine the updated user object with the profile image
//   return { ...user.toObject(), profile };
// };

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
// const updateUserById = async (userId, updateBody) => {
//   console.log(userId, updateBody);
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   console.log(user)
//   await user.save();
//   return user;
// };

const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
// const updateUserByEmail = async (email, updateBody) => {
//   // Find the user by email
//   const user = await getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // If password is being updated, hash it before saving
//   if (updateBody.password) {
//     updateBody.password = await bcrypt.hash(updateBody.password, 8);
//   }

//   // Update user fields
//   Object.assign(user, updateBody);
//   await user.save();

//   return user;
// };
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
