const httpStatus = require('http-status');
const { Invitation } = require('../models');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');

/**
 * Bulk Upload Invitations
 * @param {Array<Object>} invitations
 * @returns {Promise<Array<Invitation>>}
 */
const bulkUploadInvitations = async (invitations, user) => {
  const results = await Promise.all(
    invitations.map(async (invitation) => {
      const invitedBy = user.email;
      await emailService.sendInvitationToDistributer(invitation.email, invitation.fullName);
      const existingInvitation = await Invitation.findOne({ email: invitation.email });
      if (existingInvitation) {
        existingInvitation.invitedBy.push(invitedBy);
        return existingInvitation.save();
      }
      return Invitation.create({ ...invitation, invitedBy: [invitedBy] });
    })
  );
  return results;
};

/**
 * Bulk Upload Invitations from CSV
 * @param {Array<Object>} invitationArray
 * @param {String} csvFilePath
 * @param {Object} user
 * @returns {Promise<Array<Invitation>>}
 */
const bulkUpload = async (invitationArray = [], csvFilePath = null, user) => {
  const modifiedInvitationsArray = csvFilePath;
  if (!modifiedInvitationsArray || !modifiedInvitationsArray.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing or empty array');
  }

  const results = await Promise.all(
    modifiedInvitationsArray.map(async (invitation) => {
      const invitedBy = user.email;

      // Check if invitation already exists
      const existingInvitation = await Invitation.findOne({ email: invitation.Email });
      if (existingInvitation) {
        existingInvitation.invitedBy.push(invitedBy);
        return existingInvitation.save();
      }
      await emailService.sendInvitationToDistributer(invitation.Email, invitation.Full_Name);
      // Create new invitation
      return Invitation.create({
        fullName: invitation.Full_Name,
        companyName: invitation.Company_Name,
        email: invitation.Email,
        mobileNumber: invitation.Mobile_Number,
        invitedBy: [invitedBy],
        status: 'pending', // or other default status
        role: invitation.Role || null,
        category: invitation.Category || null,
        contryCode: `+${invitation.contryCode}` || null,
      });
    })
  );

  return results;
};

/**
 * Create an Invitation
 * @param {Object} reqBody
 * @returns {Promise<Invitation>}
 */
const createInvitation = async (reqBody, user) => {
  await emailService.sendInvitationToDistributer(reqBody.email, reqBody.fullName);
  reqBody.invitedBy = user.email;

  const existingInvitation = await Invitation.findOne({ email: reqBody.email });
  if (existingInvitation) {
    existingInvitation.invitedBy.push(reqBody.invitedBy);
    return existingInvitation.save();
  }

  reqBody.invitedBy = [reqBody.invitedBy];
  return Invitation.create(reqBody);
};
const sendReInvitation = async (email, fullName) => {
  const result = await emailService.sendInvitationToDistributer(email, fullName);
  return result;
};

const sendReInvitationBulk = async (emails, fullNames) => {
  const results = [];
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const fullName = fullNames[i]; // Ensure the fullName corresponds to the email
    const result = await emailService.sendInvitationToDistributer(email, fullName);
    results.push(result);
  }
  return results;
};

// const sendReInvitation = async (email, fullName) => {
//   const result = await emailService.sendInvitationToDistributer(email, fullName);
//   return result;
// };

// const sendReInvitationBulk = async (emails,fullNames) => {
//   const results = [];
//   for (const email of emails) {
//     const result = await emailService.sendInvitationToDistributer(email, fullName);
//     results.push(result);
//   }
//   return results;
// };

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
const updateInvitationById = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
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
  sendReInvitationBulk,
  sendReInvitation,
  bulkUploadInvitations,
  queryInvitation,
  getInvitationById,
  getUserByEmail,
  bulkUpload,
  updateInvitationById,
  deleteInvitationById,
};
