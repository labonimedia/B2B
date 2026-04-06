const httpStatus = require('http-status');
const { ChannelPartner, Invitation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Channel Partner
 * @param {Object} reqBody
 * @returns {Promise<ChannelPartner>}
 */
const createChannelPartner = async (reqBody) => {
  if (reqBody.GSTIN) {
    if (await ChannelPartner.findOne({ GSTIN: req.body.GSTIN })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'GSTIN already exists');
    }
  }

  return ChannelPartner.create(reqBody);
};

const registerChannelPartner = async (body) => {
  const existing = await ChannelPartner.findOne({ email: body.email });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Channel Partner already exists');
  }

  const invitation = await Invitation.findOne({ email: body.email });

  let registrationType = 'self';
  let linkedManufacturers = [];

  if (invitation && invitation.role === 'channelPartner') {
    registrationType = 'invited';

    linkedManufacturers = invitation.invitedBy.map((email) => ({
      manufacturerEmail: email,
      isApproved: true,
    }));

    invitation.status = 'accepted';
    await invitation.save();
  }

  return ChannelPartner.create({
    ...body,
    registrationType,
    linkedManufacturers,
  });
};

const queryChannelPartners = async (filter, options) => {
  return ChannelPartner.paginate(filter, options);
};

const getByEmail = async (email) => {
  return ChannelPartner.findOne({ email });
};

const updateByEmail = async (email, updateBody) => {
  const cp = await getByEmail(email);
  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  Object.assign(cp, updateBody);
  await cp.save();
  return cp;
};

const deleteByEmail = async (email) => {
  const cp = await getByEmail(email);
  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }
  await cp.remove();
  return cp;
};

const addRetailer = async (cpEmail, retailerData) => {
  const cp = await getByEmail(cpEmail);
  if (!cp) throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');

  cp.retailers.push(retailerData);
  await cp.save();

  return cp;
};

const getRetailers = async (cpEmail) => {
  const cp = await getByEmail(cpEmail);
  if (!cp) throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');

  return cp.retailers;
};

const linkManufacturer = async (body, user) => {
  const { cpEmail } = body;

  const cp = await getByEmail(cpEmail);
  if (!cp) throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');

  const exists = cp.linkedManufacturers.find((m) => m.manufacturerEmail === user.email);

  if (exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already linked');
  }

  cp.linkedManufacturers.push({
    manufacturerEmail: user.email,
    isApproved: true,
  });

  await cp.save();

  return cp;
};

module.exports = {
  registerChannelPartner,
  queryChannelPartners,
  getByEmail,
  updateByEmail,
  deleteByEmail,
  addRetailer,
  getRetailers,
  linkManufacturer,
  createChannelPartner,
};
