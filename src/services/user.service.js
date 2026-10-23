// const httpStatus = require('http-status');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { User, Wholesaler, Manufacture, Retailer, Counter, Invitation, ChannelPartner } = require('../models');
// const ApiError = require('../utils/ApiError');
// const { createManufacture } = require('./manufacture.service');
// const { createWholesaler } = require('./wholesaler.service');
// const { createRetailer } = require('./retailer.service');
// const { createChannelPartner } = require('./channel.partner.service');

// /**
//  * Create a user
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */

// // const createUser = async (userBody) => {
// //   // Check if the email is already taken
// //   if (await User.isEmailTaken(userBody.email)) {
// //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
// //   }

// //   // Generate unique ID based on the user's role
// //   let prefix;
// //   if (userBody.role === 'manufacture') {
// //     prefix = 'MAN';
// //   } else if (userBody.role === 'wholesaler') {
// //     prefix = 'WHO';
// //   } else if (userBody.role === 'retailer') {
// //     prefix = 'RET';
// //   } else if (userBody.role === 'channelPartner') {
// //     prefix = 'CP';
// //   } else {
// //     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
// //   }

// //   const session = await mongoose.startSession(); // Start a session

// //   try {
// //     // Check if a replica set is enabled
// //     const isReplicaSet = await mongoose.connection.db
// //       .admin()
// //       .serverStatus()
// //       .then((status) => status.repl !== undefined);

// //     if (isReplicaSet) {
// //       session.startTransaction(); // Start transaction only if a replica set exists
// //     }

// //     // Increment the sequence for the corresponding role
// //     const counter = await Counter.findOneAndUpdate(
// //       { role: userBody.role },
// //       { $inc: { seq: 1 } },
// //       { new: true, upsert: true, session: isReplicaSet ? session : undefined }
// //     );

// //     // Assign the generated user code
// //     userBody.code = `${prefix}${String(counter.seq).padStart(4, '0')}`;

// //     // Create the user in the User collection
// //     const createdUser = await User.create([userBody], isReplicaSet ? { session } : {});

// //     // Create additional data based on role
// //     const data = {
// //       fullName: userBody.fullName,
// //       companyName: userBody.companyName,
// //       email: userBody.email,
// //       mobNumber: userBody.mobileNumber,
// //       category: userBody.category,
// //       userCode: userBody.code,
// //       contryCode: userBody.contryCode,
// //       referralCode: userBody.referralCode,
// //     };

// //     if (userBody.role === 'manufacture') {
// //       await createManufacture([data], isReplicaSet ? { session } : {});
// //     } else if (userBody.role === 'wholesaler') {
// //       await createWholesaler([data], isReplicaSet ? { session } : {});
// //     } else if (userBody.role === 'retailer') {
// //       await createRetailer([data], isReplicaSet ? { session } : {});
// //     } else if (userBody.role === 'channelPartner') {
// //       await createChannelPartner([data], isReplicaSet ? { session } : {});
// //     }
// //     // Update invitation status
// //     await Invitation.findOneAndUpdate(
// //       { email: createdUser[0].email },
// //       { $set: { status: 'accepted' } },
// //       { new: true, session: isReplicaSet ? session : undefined }
// //     );

// //     if (isReplicaSet) {
// //       await session.commitTransaction();
// //     }

// //     session.endSession();

// //     return createdUser[0];
// //   } catch (error) {
// //     if (isReplicaSet) {
// //       await session.abortTransaction(); // Rollback if anything fails
// //     }
// //     session.endSession();
// //     throw error;
// //   }
// // };
// const createUser = async (userBody, loggedInUser) => {
//   // Check if email already exists
//   if (await User.isEmailTaken(userBody.email)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }

//   const staffRoles = ['rawMaterialManager', 'finishedGoodsManager', 'productManager', 'orderManager'];

//   // =========================
//   // STAFF CREATION
//   // =========================
//   if (staffRoles.includes(userBody.role)) {
//     // Only manufacturer can create staff
//     if (!loggedInUser || loggedInUser.role !== 'manufacture') {
//       throw new ApiError(httpStatus.FORBIDDEN, 'Only manufacturer can create staff users');
//     }

//     // Auto assign manufacturer email
//     userBody.createdBy = loggedInUser.email;

//     const createdUser = await User.create(userBody);

//     return createdUser;
//   }

//   // =========================
//   // EXISTING LOGIC
//   // =========================

//   let prefix;

//   if (userBody.role === 'manufacture') {
//     prefix = 'MAN';
//   } else if (userBody.role === 'wholesaler') {
//     prefix = 'WHO';
//   } else if (userBody.role === 'retailer') {
//     prefix = 'RET';
//   } else if (userBody.role === 'channelPartner') {
//     prefix = 'CP';
//   } else {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
//   }

//   const session = await mongoose.startSession();

//   try {
//     const isReplicaSet = await mongoose.connection.db
//       .admin()
//       .serverStatus()
//       .then((status) => status.repl !== undefined);

//     if (isReplicaSet) {
//       session.startTransaction();
//     }

//     const counter = await Counter.findOneAndUpdate(
//       { role: userBody.role },
//       { $inc: { seq: 1 } },
//       {
//         new: true,
//         upsert: true,
//         session: isReplicaSet ? session : undefined,
//       }
//     );

//     userBody.code = `${prefix}${String(counter.seq).padStart(4, '0')}`;

//     const createdUser = await User.create([userBody], isReplicaSet ? { session } : {});

//     const data = {
//       fullName: userBody.fullName,
//       companyName: userBody.companyName,
//       email: userBody.email,
//       mobNumber: userBody.mobileNumber,
//       category: userBody.category,
//       userCode: userBody.code,
//       contryCode: userBody.contryCode,
//       referralCode: userBody.referralCode,
//     };

//     if (userBody.role === 'manufacture') {
//       await createManufacture([data], isReplicaSet ? { session } : {});
//     } else if (userBody.role === 'wholesaler') {
//       await createWholesaler([data], isReplicaSet ? { session } : {});
//     } else if (userBody.role === 'retailer') {
//       await createRetailer([data], isReplicaSet ? { session } : {});
//     } else if (userBody.role === 'channelPartner') {
//       await createChannelPartner([data], isReplicaSet ? { session } : {});
//     }

//     await Invitation.findOneAndUpdate(
//       { email: createdUser[0].email },
//       { $set: { status: 'accepted' } },
//       {
//         new: true,
//         session: isReplicaSet ? session : undefined,
//       }
//     );

//     if (isReplicaSet) {
//       await session.commitTransaction();
//     }

//     session.endSession();

//     return createdUser[0];
//   } catch (error) {
//     if (session.inTransaction()) {
//       await session.abortTransaction();
//     }

//     session.endSession();
//     throw error;
//   }
// };

// /**
//  * Query for users
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

// // /**
// //  * Get user by id
// //  * @param {ObjectId} id
// //  * @returns {Promise<User>}
// //  */
// // const getUserById = async (id) => {
// //   const user = await User.findById(id);
// //   if (!user) {
// //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
// //   }
// //   let profile;
// //   switch (user.role) {
// //     case 'wholesaler': {
// //       const wholesaler = await Wholesaler.findOne({ email: user.email });
// //       profile = wholesaler ? wholesaler.profileImg : null;
// //       break;
// //     }
// //     case 'manufacture': {
// //       const manufacturer = await Manufacture.findOne({ email: user.email });
// //       profile = manufacturer ? manufacturer.profileImg : null;
// //       break;
// //     }
// //     case 'retailer': {
// //       const retailer = await Retailer.findOne({ email: user.email });
// //       profile = retailer ? retailer.profileImg : null;
// //       break;
// //     }
// //     case 'channelPartner': {
// //       const cp = await ChannelPartner.findOne({ email: user.email });
// //       profile = cp ? cp.profileImg : null;
// //       break;
// //     }

// //     default: {
// //       profile = null;
// //       break;
// //     }
// //   }

// //   return { ...user.toObject(), profile };
// // };
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
//     case 'wholesaler': {
//       const wholesaler = await Wholesaler.findOne({ email: user.email });
//       profile = wholesaler ? wholesaler.profileImg : null;
//       break;
//     }

//     case 'manufacture': {
//       const manufacturer = await Manufacture.findOne({ email: user.email });
//       profile = manufacturer ? manufacturer.profileImg : null;
//       break;
//     }

//     case 'retailer': {
//       const retailer = await Retailer.findOne({ email: user.email });
//       profile = retailer ? retailer.profileImg : null;
//       break;
//     }

//     case 'channelPartner': {
//       const cp = await ChannelPartner.findOne({ email: user.email });
//       profile = cp ? cp.profileImg : null;
//       break;
//     }

//     default: {
//       profile = null;
//       break;
//     }
//   }

//   const userObj = user.toObject();

//   // If user is created by a manufacturer
//   if (userObj.createdBy) {
//     return {
//       ...userObj,

//       // Frontend display values
//       role: 'manufacture',
//       email: userObj.createdBy,

//       // Actual user values
//       actualRole: userObj.role,
//       actualEmail: userObj.email,

//       profile,
//     };
//   }

//   return {
//     ...userObj,
//     profile,
//   };
// };
// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
// const getUserByEmail = async (email) => {
//   const user = await User.findOne({ email });
//   return user;
// };

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

//   if (updateBody.password) {
//     // Hash the new password before updating
//     updateBody.password = await bcrypt.hash(updateBody.password, 8);
//   }

//   // Update the user document directly in the database
//   const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Fetch the user's profile image based on the role
//   let profile;
//   switch (user.role) {
//     case 'wholesaler': {
//       const wholesaler = await Wholesaler.findOne({ email: user.email });
//       profile = wholesaler ? wholesaler.profileImg : null;
//       break;
//     }
//     case 'manufacture': {
//       const manufacturer = await Manufacture.findOne({ email: user.email });
//       profile = manufacturer ? manufacturer.profileImg : null;
//       break;
//     }
//     case 'retailer': {
//       const retailer = await Retailer.findOne({ email: user.email });
//       profile = retailer ? retailer.profileImg : null;
//       break;
//     }
//     case 'channelPartner': {
//       const cp = await ChannelPartner.findOne({ email: user.email });
//       profile = cp ? cp.profileImg : null;
//       break;
//     }
//     default: {
//       profile = null;
//       break;
//     }
//   }

//   // Combine the updated user object with the profile image
//   return { ...user.toObject(), profile };
// };

// const updateUserByEmail = async (email, updateBody) => {
//   const user = await getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

// // /**
// //  * Delete user by id
// //  * @param {ObjectId} userId
// //  * @returns {Promise<User>}
// //  */
// // const deleteUserById = async (userId) => {
// //   const user = await getUserById(userId);
// //   if (!user) {
// //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
// //   }
// //   await user.remove();
// //   return user;
// // };
// const deleteUserById = async (userId) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   await User.findByIdAndDelete(userId);

//   return user;
// };
// const deleteUserByEmail = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const { role } = user;

//   // Delete user from the User collection
//   await User.deleteOne({ email });

//   // Delete user from the respective role-based collection
//   switch (role) {
//     case 'wholesaler':
//       await Wholesaler.deleteOne({ email });
//       break;
//     case 'manufacture':
//       await Manufacture.deleteOne({ email });
//       break;
//     case 'retailer':
//       await Retailer.deleteOne({ email });
//       break;
//     case 'channelPartner':
//       await ChannelPartner.deleteOne({ email });
//       break;
//     default:
//       break;
//   }

//   return { message: 'User deleted successfully' };
// };

// module.exports = {
//   createUser,
//   queryUsers,
//   getUserById,
//   getUserByEmail,
//   updateUserByEmail,
//   updateUserById,
//   deleteUserById,
//   deleteUserByEmail,
// };

const httpStatus = require('http-status');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  User,
  Wholesaler,
  Manufacture,
  WeaverManufacture,
  Retailer,
  Counter,
  Invitation,
  ChannelPartner,
} = require('../models');

const ApiError = require('../utils/ApiError');

const { createManufacture } = require('./manufacture.service');
const { createWeaverManufacture } = require('./weaver.manufacturer.service');
const { createWholesaler } = require('./wholesaler.service');
const { createRetailer } = require('./retailer.service');
const { createChannelPartner } = require('./channel.partner.service');


/**
 * Create a user
 *
 * @param {Object} userBody
 * @param {Object} loggedInUser
 * @returns {Promise<User>}
 */
const createUser = async (userBody, loggedInUser) => {
  // Check if email already exists
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email already taken'
    );
  }

  // =========================
  // STAFF ROLES
  // =========================

  const staffRoles = [
    'rawMaterialManager',
    'finishedGoodsManager',
    'productManager',
    'orderManager',
  ];

  if (staffRoles.includes(userBody.role)) {
    // Only manufacturer can create staff
    if (
      !loggedInUser ||
      !['manufacture', 'weaverManufacture'].includes(
        loggedInUser.role
      )
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Only manufacturer can create staff users'
      );
    }

    // Automatically assign manufacturer email
    userBody.createdBy = loggedInUser.email;

    const createdUser = await User.create(userBody);

    return createdUser;
  }

  // =========================
  // ROLE PREFIX
  // =========================

  let prefix;

  if (userBody.role === 'manufacture') {
    prefix = 'MAN';
  } else if (userBody.role === 'weaverManufacture') {
    prefix = 'WVM';
  } else if (userBody.role === 'wholesaler') {
    prefix = 'WHO';
  } else if (userBody.role === 'retailer') {
    prefix = 'RET';
  } else if (userBody.role === 'channelPartner') {
    prefix = 'CP';
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid user role'
    );
  }

  const session = await mongoose.startSession();

  let isReplicaSet = false;

  try {
    // =========================
    // CHECK REPLICA SET
    // =========================

    isReplicaSet = await mongoose.connection.db
      .admin()
      .serverStatus()
      .then(
        (status) => status.repl !== undefined
      );

    // Start transaction only for replica set
    if (isReplicaSet) {
      session.startTransaction();
    }

    // =========================
    // GENERATE USER CODE
    // =========================

    const counter = await Counter.findOneAndUpdate(
      {
        role: userBody.role,
      },
      {
        $inc: {
          seq: 1,
        },
      },
      {
        new: true,
        upsert: true,
        session: isReplicaSet
          ? session
          : undefined,
      }
    );

    userBody.code = `${prefix}${String(
      counter.seq
    ).padStart(4, '0')}`;

    // =========================
    // CREATE USER
    // =========================

    const createdUser = await User.create(
      [userBody],
      isReplicaSet
        ? { session }
        : {}
    );

    // =========================
    // COMMON PROFILE DATA
    // =========================

    const data = {
      fullName: userBody.fullName,
      companyName: userBody.companyName,
      email: userBody.email,
      mobNumber: userBody.mobileNumber,
      category: userBody.category,
      userCode: userBody.code,
      contryCode: userBody.contryCode,
      referralCode: userBody.referralCode,
    };

    // =========================
    // CREATE ROLE PROFILE
    // =========================

    if (userBody.role === 'manufacture') {
      await createManufacture(
        data
      );

    } else if (
      userBody.role === 'weaverManufacture'
    ) {
      await createWeaverManufacture(
        data
      );

    } else if (
      userBody.role === 'wholesaler'
    ) {
      await createWholesaler(
        data
      );

    } else if (
      userBody.role === 'retailer'
    ) {
      await createRetailer(
        data
      );

    } else if (
      userBody.role === 'channelPartner'
    ) {
      await createChannelPartner(
        data
      );
    }

    // =========================
    // UPDATE INVITATION
    // =========================

    await Invitation.findOneAndUpdate(
      {
        email: createdUser[0].email,
      },
      {
        $set: {
          status: 'accepted',
        },
      },
      {
        new: true,
        session: isReplicaSet
          ? session
          : undefined,
      }
    );

    // =========================
    // COMMIT
    // =========================

    if (isReplicaSet) {
      await session.commitTransaction();
    }

    return createdUser[0];

  } catch (error) {

    // Rollback transaction
    if (
      isReplicaSet &&
      session.inTransaction()
    ) {
      await session.abortTransaction();
    }

    throw error;

  } finally {
    await session.endSession();
  }
};


/**
 * Query users
 *
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (
  filter,
  options
) => {
  return User.paginate(
    filter,
    options
  );
};


/**
 * Get user by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  let profile = null;

  switch (user.role) {

    // =========================
    // WHOLESALER
    // =========================

    case 'wholesaler': {

      const wholesaler =
        await Wholesaler.findOne({
          email: user.email,
        });

      profile = wholesaler
        ? wholesaler.profileImg
        : null;

      break;
    }

    // =========================
    // MANUFACTURE
    // =========================

    case 'manufacture': {

      const manufacturer =
        await Manufacture.findOne({
          email: user.email,
        });

      profile = manufacturer
        ? manufacturer.profileImg
        : null;

      break;
    }

    // =========================
    // WEAVING MANUFACTURER
    // =========================

    case 'weaverManufacture': {

      const weaverManufacture =
        await WeaverManufacture.findOne({
          email: user.email,
        });

      profile = weaverManufacture
        ? weaverManufacture.profileImg
        : null;

      break;
    }

    // =========================
    // RETAILER
    // =========================

    case 'retailer': {

      const retailer =
        await Retailer.findOne({
          email: user.email,
        });

      profile = retailer
        ? retailer.profileImg
        : null;

      break;
    }

    // =========================
    // CHANNEL PARTNER
    // =========================

    case 'channelPartner': {

      const cp =
        await ChannelPartner.findOne({
          email: user.email,
        });

      profile = cp
        ? cp.profileImg
        : null;

      break;
    }

    default:
      profile = null;
  }

  const userObj = user.toObject();

  // =========================
  // STAFF USER
  // =========================

  if (userObj.createdBy) {

    return {
      ...userObj,

      role: 'manufacture',

      email: userObj.createdBy,

      actualRole: userObj.role,

      actualEmail: userObj.email,

      profile,
    };
  }

  return {
    ...userObj,
    profile,
  };
};


/**
 * Get user by email
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (
  email
) => {
  return User.findOne({
    email,
  });
};


/**
 * Update user by ID
 *
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (
  userId,
  updateBody
) => {

  // Check email uniqueness
  if (
    updateBody.email &&
    (await User.isEmailTaken(
      updateBody.email,
      userId
    ))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email already taken'
    );
  }

  // Hash password
  if (updateBody.password) {
    updateBody.password =
      await bcrypt.hash(
        updateBody.password,
        8
      );
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      updateBody,
      {
        new: true,
      }
    );

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  // =========================
  // GET PROFILE IMAGE
  // =========================

  let profile = null;

  switch (user.role) {

    case 'wholesaler': {

      const wholesaler =
        await Wholesaler.findOne({
          email: user.email,
        });

      profile = wholesaler
        ? wholesaler.profileImg
        : null;

      break;
    }

    case 'manufacture': {

      const manufacturer =
        await Manufacture.findOne({
          email: user.email,
        });

      profile = manufacturer
        ? manufacturer.profileImg
        : null;

      break;
    }

    case 'weaverManufacture': {

      const weaverManufacture =
        await WeaverManufacture.findOne({
          email: user.email,
        });

      profile = weaverManufacture
        ? weaverManufacture.profileImg
        : null;

      break;
    }

    case 'retailer': {

      const retailer =
        await Retailer.findOne({
          email: user.email,
        });

      profile = retailer
        ? retailer.profileImg
        : null;

      break;
    }

    case 'channelPartner': {

      const cp =
        await ChannelPartner.findOne({
          email: user.email,
        });

      profile = cp
        ? cp.profileImg
        : null;

      break;
    }

    default:
      profile = null;
  }

  return {
    ...user.toObject(),
    profile,
  };
};


/**
 * Update user by email
 *
 * @param {string} email
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByEmail = async (
  email,
  updateBody
) => {

  const user =
    await getUserByEmail(email);

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  Object.assign(
    user,
    updateBody
  );

  await user.save();

  return user;
};


/**
 * Delete user by ID
 *
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (
  userId
) => {

  const user =
    await User.findById(userId);

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  await User.findByIdAndDelete(
    userId
  );

  return user;
};


/**
 * Delete user by email
 *
 * Deletes the User and the corresponding
 * role-based profile.
 *
 * @param {string} email
 * @returns {Promise<Object>}
 */
const deleteUserByEmail = async (
  email
) => {

  const user =
    await User.findOne({
      email,
    });

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  const {
    role,
  } = user;

  // =========================
  // DELETE USER
  // =========================

  await User.deleteOne({
    email,
  });

  // =========================
  // DELETE ROLE PROFILE
  // =========================

  switch (role) {

    case 'wholesaler':

      await Wholesaler.deleteOne({
        email,
      });

      break;

    case 'manufacture':

      await Manufacture.deleteOne({
        email,
      });

      break;

    case 'weaverManufacture':

      await WeaverManufacture.deleteOne({
        email,
      });

      break;

    case 'retailer':

      await Retailer.deleteOne({
        email,
      });

      break;

    case 'channelPartner':

      await ChannelPartner.deleteOne({
        email,
      });

      break;

    default:
      break;
  }

  return {
    message:
      'User deleted successfully',
  };
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