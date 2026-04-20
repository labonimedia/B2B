const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { ChannelPartnerCustomer, User } = require('../models');
const ApiError = require('../utils/ApiError');

const handleFileFields = (body, files) => {
  if (files?.file?.length > 0) {
    body.file = files.file[0]; // URL from middleware
  }

  if (files?.profileImg?.length > 0) {
    body.profileImg = files.profileImg[0];
  }

  return body;
};

const fileupload = async (req, id) => {
  // 🔍 Find ShopKeeper
  const shopKeeper = await ChannelPartnerCustomer.findById(id);

  if (!shopKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopKeeper not found');
  }

  // 📄 Document file
  if (req.body.file) {
    shopKeeper.file = req.body.file ? req.body.file[0] : null;
  }

  // 🖼️ Profile Image
  if (req.body.profileImg) {
    shopKeeper.profileImg = req.body.profileImg ? req.body.profileImg[0] : null;
  }

  // 🏷️ Optional filename
  if (req.body.fileName) {
    shopKeeper.fileName = req.body.fileName || '';
  }

  await shopKeeper.save();

  return shopKeeper;
};

/**
 * 🔥 CREATE SHOPKEEPER (User + Profile)
 */
const createShopKeeper = async (cpEmail, body, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, fullName, mobileNumber, shopName, password, city, state, country } = body;

    handleFileFields(body, files);

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const existingShopKeeper = await ChannelPartnerCustomer.findOne({
      channelPartnerEmail: cpEmail,
      email,
    }).session(session);

    if (existingShopKeeper) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'ShopKeeper already exists');
    }

    const user = await User.create(
      [
        {
          fullName,
          email,
          password,
          mobileNumber,
          role: 'shopKeeper',
        },
      ],
      { session }
    );

    // ✅ Create ShopKeeper
    const shopKeeper = await ChannelPartnerCustomer.create(
      [
        {
          ...body,
          channelPartnerEmail: cpEmail,
          addedBy: cpEmail,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: 'ShopKeeper created successfully',
      user: user[0],
      shopKeeper: shopKeeper[0],
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * 📄 GET ALL SHOPKEEPERS
 */
const queryShopKeepers = async (filter, options) => {
  return ChannelPartnerCustomer.paginate(filter, options);
};

/**
 * 🔍 GET BY ID
 */
const getShopKeeperById = async (id) => {
  const data = await ChannelPartnerCustomer.findById(id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopKeeper not found');
  }

  return data;
};

/**
 * ✏️ UPDATE
 */
const updateShopKeeper = async (id, body, files) => {
  const shopKeeper = await ChannelPartnerCustomer.findById(id);

  if (!shopKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopKeeper not found');
  }

  // ✅ FILE HANDLE
  if (files?.file?.length > 0) {
    // OPTIONAL: delete old file here
    // await deleteFile(shopKeeper.file);
    body.file = files.file[0];
  }

  if (files?.profileImg?.length > 0) {
    // OPTIONAL: delete old image
    // await deleteFile(shopKeeper.profileImg);
    body.profileImg = files.profileImg[0];
  }

  // 🧹 CLEAN EMPTY VALUES
  Object.keys(body).forEach((key) => {
    if (body[key] === '' || body[key] === null || body[key] === undefined) {
      delete body[key];
    }
  });

  // ✅ UPDATE
  Object.assign(shopKeeper, body);

  await shopKeeper.save();

  return shopKeeper;
};

/**
 * ❌ DELETE (SOFT DELETE)
 */
const deleteShopKeeper = async (id) => {
  const data = await getShopKeeperById(id);

  data.isActive = false;
  data.status = 'blocked';

  await data.save();

  return { message: 'ShopKeeper deactivated successfully' };
};

module.exports = {
  createShopKeeper,
  queryShopKeepers,
  getShopKeeperById,
  updateShopKeeper,
  deleteShopKeeper,
  fileupload,
};
