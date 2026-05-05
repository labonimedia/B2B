const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { ChannelPartnerCustomer, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteFile } = require('../utils/upload');

const handleFileFields = (body) => {
  if (Array.isArray(body.file) && body.file.length > 0) {
    body.file = body.file[0]; // ✅ URL
  }

  if (Array.isArray(body.profileImg) && body.profileImg.length > 0) {
    body.profileImg = body.profileImg[0];
  }

  return body;
};

const fileupload = async (req, id) => {
  const shopKeeper = await ChannelPartnerCustomer.findById(id);

  if (!shopKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopKeeper not found');
  }

  // ✅ HANDLE FILES FROM req.body
  if (Array.isArray(req.body.file) && req.body.file.length > 0) {
    shopKeeper.file = req.body.file[0];
  }

  if (Array.isArray(req.body.profileImg) && req.body.profileImg.length > 0) {
    shopKeeper.profileImg = req.body.profileImg[0];
  }

  if (req.body.fileName) {
    shopKeeper.fileName = req.body.fileName;
  }

  await shopKeeper.save();

  return shopKeeper;
};

/**
 * 🔥 CREATE SHOPKEEPER (User + Profile)
 */
const createShopKeeper = async (cpEmail, body) => {
  try {
    const { email, fullName, mobileNumber, password } = body;

    if (!password || password.length < 8) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password must be at least 8 characters');
    }

    // ✅ FIXED FILE HANDLING
    if (Array.isArray(body.file)) {
      body.file = body.file[0];
    }

    if (Array.isArray(body.profileImg)) {
      body.profileImg = body.profileImg[0];
    }

    // ✅ CLEAN EMPTY VALUES
    Object.keys(body).forEach((key) => {
      if (!body[key]) delete body[key];
    });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const existingShopKeeper = await ChannelPartnerCustomer.findOne({
      channelPartnerEmail: cpEmail,
      email,
    });

    if (existingShopKeeper) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'ShopKeeper already exists');
    }

    const user = await User.create({
      fullName,
      email,
      password,
      mobileNumber,
      role: 'shopKeeper',
    });

    delete body.password;

    const shopKeeper = await ChannelPartnerCustomer.create({
      ...body,
      channelPartnerEmail: cpEmail,
      addedBy: cpEmail,
    });

    return {
      message: 'ShopKeeper created successfully',
      user,
      shopKeeper,
    };
  } catch (error) {
    console.error('CREATE SHOPKEEPER ERROR:', error);
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
const updateShopKeeper = async (id, body) => {
  const shopKeeper = await ChannelPartnerCustomer.findById(id);

  if (!shopKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopKeeper not found');
  }

  // ✅ FILE HANDLE
  if (Array.isArray(body.file) && body.file.length > 0) {
    if (shopKeeper.file) {
      try {
        await deleteFile(shopKeeper.file);
      } catch (err) {
        console.error('File delete failed:', err.message);
      }
    }
    body.file = body.file[0];
  } else {
    delete body.file;
  }

  if (Array.isArray(body.profileImg) && body.profileImg.length > 0) {
    if (shopKeeper.profileImg) {
      try {
        await deleteFile(shopKeeper.profileImg);
      } catch (err) {
        console.error('Profile image delete failed:', err.message);
      }
    }
    body.profileImg = body.profileImg[0];
  } else {
    delete body.profileImg;
  }

  // ✅ CLEAN EMPTY
  Object.keys(body).forEach((key) => {
    if (body[key] === '' || body[key] === null || body[key] === undefined) {
      delete body[key];
    }
  });

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
