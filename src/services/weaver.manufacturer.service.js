const httpStatus = require('http-status');
const {
  WeaverManufacture,
  User,
  ProductType2,
} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Weaver Manufacturer
 * @param {Object} reqBody
 * @returns {Promise<WeaverManufacture>}
 */
const createWeaverManufacture = async (reqBody) => {
  // Check duplicate GSTIN
  if (reqBody.GSTIN) {
    const existingManufacture = await WeaverManufacture.findOne({
      GSTIN: reqBody.GSTIN,
    });

    if (existingManufacture) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'GSTIN already exists'
      );
    }
  }

  // Check duplicate email
  if (reqBody.email) {
    const existingEmail = await WeaverManufacture.findOne({
      email: reqBody.email,
    });

    if (existingEmail) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Email already exists'
      );
    }
  }

  return WeaverManufacture.create(reqBody);
};

/**
 * Upload file / profile image
 * @param {Object} req
 * @param {ObjectId} id
 * @returns {Promise<WeaverManufacture>}
 */
const fileUpload = async (req, id) => {
  const manufacture = await WeaverManufacture.findById(id);

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  if (req.body.file) {
    manufacture.file = req.body.file[0];
  }

  if (req.body.profileImg) {
    manufacture.profileImg = req.body.profileImg[0];
  }

  if (req.body.fileName) {
    manufacture.fileName = req.body.fileName;
  }

  await manufacture.save();

  return manufacture;
};

/**
 * Query Weaver Manufacturers
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverManufacture = async (filter, options) => {
  return WeaverManufacture.paginate(filter, options);
};

/**
 * Get Weaver Manufacturer by ID
 * @param {ObjectId} id
 * @returns {Promise<WeaverManufacture>}
 */
const getWeaverManufactureById = async (id) => {
  const manufacture = await WeaverManufacture.findById(id);

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  return manufacture;
};

/**
 * Get Weaver Manufacturer by email
 * @param {string} email
 * @returns {Promise<WeaverManufacture>}
 */
const getWeaverManufactureByEmail = async (email) => {
  const manufacture = await WeaverManufacture.findOne({
    email,
  });

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  return manufacture;
};

/**
 * Get Weaver Manufacturers by referred email
 *
 * Finds Users where refByEmail matches the provided value,
 * then gets Weaver Manufacturers using those users' emails.
 *
 * @param {string} refByEmail
 * @param {string} searchKeywords
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getWeaverManufactureByRefEmail = async (
  refByEmail,
  searchKeywords = '',
  options = {}
) => {
  const users = await User.find({
    refByEmail,
  }).select('email');

  if (!users || users.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No users found with the specified refByEmail'
    );
  }

  const referredEmails = users
    .map((user) => user.email)
    .filter(Boolean);

  if (referredEmails.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No referred emails found'
    );
  }

  const manufactureFilter = {
    email: {
      $in: referredEmails,
    },
  };

  // Add search only when keyword exists
  if (searchKeywords) {
    const searchRegex = new RegExp(searchKeywords, 'i');

    manufactureFilter.$or = [
      {
        fullName: {
          $regex: searchRegex,
        },
      },
      {
        companyName: {
          $regex: searchRegex,
        },
      },
      {
        country: {
          $regex: searchRegex,
        },
      },
      {
        city: {
          $regex: searchRegex,
        },
      },
    ];
  }

  return WeaverManufacture.paginate(
    manufactureFilter,
    options
  );
};

/**
 * Update Weaver Manufacturer by email
 *
 * Also updates common fields in User model.
 *
 * @param {string} email
 * @param {Object} updateBody
 * @returns {Promise<WeaverManufacture>}
 */
const updateWeaverManufactureById = async (
  email,
  updateBody
) => {
  const manufacture = await WeaverManufacture.findOne({
    email,
  });

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  /**
   * Fields which should also be updated
   * inside User model.
   */
  const fieldMap = {
    fullName: 'fullName',
    companyName: 'companyName',
    mobNumber: 'mobileNumber',
  };

  const userUpdateBody = {};

  Object.keys(updateBody).forEach((key) => {
    const userField = fieldMap[key];

    if (userField) {
      userUpdateBody[userField] = updateBody[key];
    }
  });

  /**
   * If email is being changed,
   * check whether new email already exists.
   */
  if (updateBody.email && updateBody.email !== email) {
    const manufactureEmailExists =
      await WeaverManufacture.findOne({
        email: updateBody.email,
        _id: {
          $ne: manufacture._id,
        },
      });

    if (manufactureEmailExists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Email already exists'
      );
    }

    const userEmailExists = await User.isEmailTaken(
      updateBody.email,
      user._id
    );

    if (userEmailExists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Email already taken'
      );
    }

    userUpdateBody.email = updateBody.email;
  }

  /**
   * Update User document
   */
  if (Object.keys(userUpdateBody).length > 0) {
    Object.assign(user, userUpdateBody);
    await user.save();
  }

  /**
   * Update Weaver Manufacturer document
   */
  Object.assign(manufacture, updateBody);

  await manufacture.save();

  return manufacture;
};

/**
 * Delete Weaver Manufacturer by ID
 *
 * @param {ObjectId} manufactureId
 * @returns {Promise<WeaverManufacture>}
 */
const deleteWeaverManufactureById = async (
  manufactureId
) => {
  const manufacture =
    await WeaverManufacture.findById(manufactureId);

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  await manufacture.deleteOne();

  return manufacture;
};

/**
 * Delete Weaver Manufacturer by email
 *
 * @param {string} email
 * @returns {Promise<WeaverManufacture>}
 */
const deleteWeaverManufactureByEmail = async (email) => {
  const manufacture =
    await WeaverManufacture.findOne({ email });

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  await manufacture.deleteOne();

  return manufacture;
};

/**
 * Update visibility settings
 *
 * @param {ObjectId} manufactureId
 * @param {Object} payload
 * @returns {Promise<WeaverManufacture>}
 */
const updateVisibilitySettings = async (
  manufactureId,
  payload
) => {
  const manufacture =
    await WeaverManufacture.findById(manufactureId);

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  /**
   * Simple visibility fields
   */
  const simpleFields = [
    'logo',
    'file',
    'fileName',
    'profileImg',
    'currency',
    'leagalStatusOfFirm',
    'fullName',
    'companyName',
    'email',
    'address',
    'state',
    'introduction',
    'city',
    'country',
    'referralCode',
    'pinCode',
    'mobNumber',
    'mobNumber2',
    'email2',
    'GSTIN',
    'pan',
    'kycVerified',
    'code',
    'establishDate',
    'turnover',
    'registerOnFTH',
    'delingInView',
    'isActive',
  ];

  simpleFields.forEach((field) => {
    if (payload[field] !== undefined) {
      manufacture.visibilitySettings[field] =
        payload[field];
    }
  });

  /**
   * Social Media visibility
   */
  const socialMediaFields = [
    'facebook',
    'instagram',
    'linkedIn',
    'webSite',
  ];

  if (payload.socialMedia) {
    socialMediaFields.forEach((field) => {
      if (
        payload.socialMedia[field] !== undefined
      ) {
        manufacture.visibilitySettings[
          `socialMedia.${field}`
        ] = payload.socialMedia[field];
      }
    });
  }

  /**
   * Bank Details visibility
   */
  const bankFields = [
    'accountNumber',
    'accountType',
    'bankName',
    'IFSCcode',
    'swiftCode',
    'country',
    'city',
    'branch',
  ];

  if (payload.BankDetails) {
    bankFields.forEach((field) => {
      if (
        payload.BankDetails[field] !== undefined
      ) {
        manufacture.visibilitySettings[
          `BankDetails.${field}`
        ] = payload.BankDetails[field];
      }
    });
  }

  await manufacture.save();

  return manufacture;
};

/**
 * Get visible profile
 *
 * Returns manufacturer profile according to
 * visibility settings.
 *
 * @param {ObjectId} manufactureId
 * @returns {Promise<Object>}
 */
const getVisibleProfile = async (manufactureId) => {
  const manufacture =
    await WeaverManufacture.findById(manufactureId);

  if (!manufacture) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Weaver Manufacturer not found'
    );
  }

  const data = manufacture.toObject();
  const visibility =
    data.visibilitySettings || {};

  /**
   * Remove visibilitySettings from public response.
   */
  delete data.visibilitySettings;

  /**
   * Filter top-level fields
   */
  const topLevelFields = [
    'logo',
    'file',
    'fileName',
    'profileImg',
    'currency',
    'leagalStatusOfFirm',
    'fullName',
    'companyName',
    'email',
    'address',
    'state',
    'introduction',
    'city',
    'country',
    'referralCode',
    'pinCode',
    'mobNumber',
    'mobNumber2',
    'email2',
    'GSTIN',
    'pan',
    'kycVerified',
    'establishDate',
    'turnover',
    'registerOnFTH',
    'isActive',
  ];

  topLevelFields.forEach((field) => {
    if (visibility[field] === false) {
      delete data[field];
    }
  });

  /**
   * Filter Social Media
   */
  if (data.socialMedia) {
    const socialFields = [
      'facebook',
      'instagram',
      'linkedIn',
      'webSite',
    ];

    socialFields.forEach((field) => {
      if (
        visibility[`socialMedia.${field}`] === false
      ) {
        delete data.socialMedia[field];
      }
    });
  }

  /**
   * Filter Bank Details
   */
  if (data.BankDetails) {
    const bankFields = [
      'accountNumber',
      'accountType',
      'bankName',
      'IFSCcode',
      'swiftCode',
      'country',
      'city',
      'branch',
    ];

    bankFields.forEach((field) => {
      if (
        visibility[`BankDetails.${field}`] === false
      ) {
        delete data.BankDetails[field];
      }
    });
  }

  /**
   * Get unique products if enabled
   */
  let uniqueProducts = [];

  if (visibility.delingInView !== false) {
    const products = await ProductType2.find({
      productBy: manufacture.email,
    })
      .select(
        'productType gender clothing subCategory'
      )
      .lean();

    const uniqueSet = new Set();

    uniqueProducts = products.filter((product) => {
      const uniqueKey =
        `${product.productType}-${product.gender}-` +
        `${product.clothing}-${product.subCategory}`;

      if (uniqueSet.has(uniqueKey)) {
        return false;
      }

      uniqueSet.add(uniqueKey);

      return true;
    });
  }

  return {
    ...data,
    uniqueProducts,
  };
};

module.exports = {
  createWeaverManufacture,
  fileUpload,
  queryWeaverManufacture,
  getWeaverManufactureById,
  getWeaverManufactureByEmail,
  getWeaverManufactureByRefEmail,
  updateWeaverManufactureById,
  deleteWeaverManufactureById,
  deleteWeaverManufactureByEmail,
  updateVisibilitySettings,
  getVisibleProfile,
};