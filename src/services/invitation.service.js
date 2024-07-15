const httpStatus = require('http-status');
const { Invitation } = require('../models');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');
/**
 * Bulk Upload Invitations
 * @param {Array<Object>} invitations
 * @returns {Promise<Array<Invitation>>}
 */
// const bulkUploadInvitations = async (invitations) => {
//     const results = await Promise.all(
//       invitations.map(async (invitation) => {
//         await emailService.sendInvitationToDistributer(invitation.email);
//         return Invitation.create(invitation);
//       })
//     );
//     return results;
//   };

const bulkUploadInvitations = async (invitations) => {
    const results = await Promise.all(
      invitations.map(async (invitation) => {
        try {
          await emailService.sendInvitationToDistributer(invitation.email);
          const createdInvitation = await Invitation.create(invitation);
          return { success: true, data: createdInvitation };
        } catch (error) {
          return { success: false, error: error.message, invitation };
        }
      })
    );
    return results;
  };
  
/**
 * Create a Invitation
 * @param {Object} reqBody
 * @returns {Promise<Invitation>}
 */
const createInvitation = async (reqBody) => {
   await emailService.sendInvitationToDistributer(reqBody.email)
  return Invitation.create(reqBody);
};

/**
 * Query for Invitation
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInvitation = async (filter, options) => {
  const invitations = await Invitation.paginate(filter, options);
  return invitations;
};

/**
 * Get Invitation by id
 * @param {ObjectId} idemailService
 * @returns {Promise<Invitation>}
 */
const getInvitationById = async (id) => {
  return Invitation.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Invitation>}
 */
const getUserByEmail = async (email) => {
  return Invitation.findOne({ email });
};

/**
 * Update Invitation by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Invitation>}
 */
const updateInvitationById = async (Id, updateBody) => {
  const user = await getUserByEmail(Id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
  }
  if (updateBody.email && (await Invitation.isEmailTaken(updateBody.email, Id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Invitation>}
 */
const deleteInvitationById = async (userId) => {
  const user = await getUserByEmail(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createInvitation,
  bulkUploadInvitations,
  queryInvitation,
  getInvitationById,
  getUserByEmail,
  updateInvitationById,
  deleteInvitationById,
};
