const httpStatus = require('http-status');
const { ChannelPartner, Invitation, User, Manufacture } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteFile } = require('../utils/upload');

const createByManufacturer = async (body, manufacturer) => {
  try {
    const { email, password, fullName } = body;

    // ❌ FIX PASSWORD VALIDATION
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // ✅ SAFE JSON PARSE
    const safeParse = (data) => {
      try {
        return typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        return {};
      }
    };

    body.socialMedia = safeParse(body.socialMedia);
    body.BankDetails = safeParse(body.BankDetails);

    // ✅ HANDLE FILES
    if (body.file && Array.isArray(body.file)) {
      body.file = body.file[0].path;
    }

    if (body.profileImg && Array.isArray(body.profileImg)) {
      body.profileImg = body.profileImg[0].path;
    }

    // ✅ CLEAN EMPTY FIELDS
    const cleanedBody = Object.fromEntries(
      Object.entries(body).filter(
        ([_, value]) =>
          value !== '' &&
          value !== null &&
          value !== undefined
      )
    );

    // ✅ CHECK CP
    let cp = await ChannelPartner.findOne({ email });

    if (!cp) {
      cp = await ChannelPartner.create({
        ...cleanedBody,
        linkedManufacturers: [
          {
            manufacturerEmail: manufacturer.email,
            manufacturerName: manufacturer.companyName,
            isApproved: true,
          },
        ],
        registrationType: 'byManufacturer',
      });
    } else {
      const alreadyLinked = cp.linkedManufacturers.find(
        (m) => m.manufacturerEmail === manufacturer.email
      );

      if (!alreadyLinked) {
        cp.linkedManufacturers.push({
          manufacturerEmail: manufacturer.email,
          manufacturerName: manufacturer.companyName,
          isApproved: true,
        });

        if (cleanedBody.file) cp.file = cleanedBody.file;
        if (cleanedBody.profileImg) cp.profileImg = cleanedBody.profileImg;

        await cp.save();
      }
    }

    // ✅ CREATE USER
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      await User.create({
        fullName,
        email,
        password,
        role: 'channelPartner',
        mobileNumber: body.mobNumber || '9999999999',
      });
    }

    // ✅ UPDATE MANUFACTURER
    await Manufacture.findOneAndUpdate(
      { email: manufacturer.email },
      {
        $addToSet: {
          linkedChannelPartners: {
            cpEmail: email,
            cpName: fullName,
          },
        },
      }
    );

    return cp;
  } catch (error) {
    console.error('🔥 ERROR:', error.message);
    throw error;
  }
};

// eslint-disable-next-line prettier/prettier
/**
 * Create a Channel Partner
 * @param {Object} reqBody
 * @returns {Promise<ChannelPartner>}
 */
const createChannelPartner = async (reqBody) => {
  if (reqBody.email) {
    if (await ChannelPartner.findOne({ email: reqBody.email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }
  }

  return ChannelPartner.create(reqBody);
};

const registerChannelPartner = async (body) => {
  const existing = await ChannelPartner.findOne({ email: body.email });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Channel Partner already exists');
  }

  // ✅ HANDLE FILES
  if (body.file) {
    body.file = body.file[0];
  }

  if (body.profileImg) {
    body.profileImg = body.profileImg[0];
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

  // 🔥 HANDLE FILE UPLOADS

  // 📄 Document file
  if (updateBody.file) {
    // delete old file (optional best practice)
    if (cp.file) {
      try {
        await deleteFile(cp.file);
      } catch (err) {
        console.error('Old file delete failed:', err.message);
      }
    }

    updateBody.file = updateBody.file[0];
  }

  // 🖼️ Profile Image
  if (updateBody.profileImg) {
    if (cp.profileImg) {
      try {
        await deleteFile(cp.profileImg);
      } catch (err) {
        console.error('Old profile image delete failed:', err.message);
      }
    }

    updateBody.profileImg = updateBody.profileImg[0];
  }

  // 🏷️ File Name (optional)
  if (updateBody.fileName) {
    cp.fileName = updateBody.fileName;
  }

  // 🔥 UPDATE DATA
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

const assignOrUpdateCommission = async (email, id, commissionGivenBy, category, productCommission, shippingCommission) => {
  const cp = await ChannelPartner.findOne({ email });

  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  const existingIndex = cp.commissionGiven.findIndex((item) => item.commissionGivenBy === commissionGivenBy);

  if (existingIndex !== -1) {
    // ✅ UPDATE EXISTING
    cp.commissionGiven[existingIndex].category = category;
    cp.commissionGiven[existingIndex].id = id;
    cp.commissionGiven[existingIndex].productCommission = productCommission;
    cp.commissionGiven[existingIndex].shippingCommission = shippingCommission;
  } else {
    // ✅ ADD NEW
    cp.commissionGiven.push({
      commissionGivenBy,
      id,
      category,
      productCommission,
      shippingCommission,
    });
  }

  await cp.save();
  return cp;
};

const getCommissionByGivenBy = async (channelPartnerId, commissionGivenBy) => {
  const cp = await ChannelPartner.findById(channelPartnerId);

  if (!cp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Channel Partner not found');
  }

  const commission = cp.commissionGiven.find((item) => item.commissionGivenBy === commissionGivenBy);

  if (!commission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission not found');
  }

  return commission;
};

const getCPByManufacturer = async (filter, options, manufacturerEmail) => {
  // 🔥 Fetch CPs
  const cps = await ChannelPartner.paginate(filter, options);

  // 🔥 Attach manufacturer-specific approval status
  const results = cps.results.map((cp) => {
    const manufacturerLink = cp.linkedManufacturers.find(
      (m) => m.manufacturerEmail === manufacturerEmail
    );

    return {
      ...cp.toJSON(),
      isApprovedForThisManufacturer: manufacturerLink?.isApproved || false,
    };
  });

  return {
    ...cps,
    results,
  };
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
  assignOrUpdateCommission,
  getCommissionByGivenBy,
  createByManufacturer,
  getCPByManufacturer,
};
