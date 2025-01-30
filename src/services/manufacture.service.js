const httpStatus = require('http-status');
const { Manufacture, User, Wholesaler, Retailer, ProductType2 } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a manufacture
 * @param {Object} reqBody
 * @returns {Promise<Manufacture>}
 */
const createManufacture = async (reqBody) => {
  if (reqBody.GSTIN) {
    if (await Manufacture.findOne({ GSTIN: reqBody.GSTIN })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'GSTIN already exists');
    }
  }
  return Manufacture.create(reqBody);
};

const fileupload = async (req, id) => {
  // Find the document by ID
  const manufacture = await Manufacture.findById(id);

  if (!manufacture) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }

  // const extractPath = (url) => new URL(url).pathname;
  if (req.body.file) {
    manufacture.file = req.body.file ? req.body.file[0] : null
  }
  if (req.body.profileImg) {
    // const profileImg = req.body.profileImg ? extractPath(req.body.profileImg[0]) : null;
    manufacture.profileImg = req.body.profileImg ? req.body.profileImg[0] : null;
  }
  if (req.body.fileName) {
    const fileName = req.body.fileName || '';
    manufacture.fileName = fileName;
  }

  await manufacture.save();
  return manufacture;
};

/**
 * Query for manufacture
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryManufacture = async (filter, options) => {
  const manufacture = await Manufacture.paginate(filter, options);
  return manufacture;
};

/**
 * Get manufacture by id
 * @param {ObjectId} id
 * @returns {Promise<Manufacture>}
 */
const getManufactureById = async (id) => {
  return Manufacture.findById(id);
};

/**
 * Get manufacture by id
 * @param {variable} refByEmail
 * @returns {Promise<Manufacture>}
 */

const getManufactureByEmail = async (refByEmail, searchKeywords = '', options = {}) => {
  // Step 1: Find users with the specified email in their refByEmail field
  const users = await User.find({ refByEmail });
  if (!users || users.length === 0) {
    throw new Error('No users found with the specified refByEmail');
  }
  // Step 2: Extract the emails of the referred users
  const referredEmails = users.map((user) => user.email);
  if (referredEmails.length === 0) {
    throw new Error('No referred emails found');
  }
  const searchRegex = new RegExp(searchKeywords, 'i');
  // Step 3: Create a filter for the Manufacture records
  const manufactureFilter = {
    email: { $in: referredEmails },
    $or: [
      { fullName: { $regex: searchRegex } },
      { companyName: { $regex: searchRegex } },
      { country: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
    ],
  };
  const manufactures = await Wholesaler.paginate(manufactureFilter, options);
  return manufactures;
};

/**
 * Get manufacture by id
 * @param {variable} refByEmail
 * @returns {Promise<Manufacture>}
 */

const getRetailersByEmail = async (refByEmail, searchKeywords = '', options = {}) => {
  // Step 1: Find users with the specified email in their refByEmail field
  const users = await User.find({ refByEmail });
  if (!users || users.length === 0) {
    throw new Error('No users found with the specified refByEmail');
  }
  // Step 2: Extract the emails of the referred users
  const referredEmails = users.map((user) => user.email);
  if (referredEmails.length === 0) {
    throw new Error('No referred emails found');
  }
  const searchRegex = new RegExp(searchKeywords, 'i');
  // Step 3: Create a filter for the Manufacture records
  const manufactureFilter = {
    email: { $in: referredEmails },
    $or: [
      { fullName: { $regex: searchRegex } },
      { companyName: { $regex: searchRegex } },
      { country: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
    ],
  };
  const manufactures = await Retailer.paginate(manufactureFilter, options);
  return manufactures;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Manufacture>}
 */
const getUserByEmail = async (email) => {
  return Manufacture.findOne({ email });
};

/**
 * Update manufacture by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Manufacture>}
 */
const updateManufactureById = async (email, updateBody) => {
  const manufacturer = await getUserByEmail(email);
  if (!manufacturer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update the user collection
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateBody },
      { new: true, session }
    );

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Update manufacturer collection
    const updatedManufacturer = await Manufacture.findOneAndUpdate(
      { email },
      { $set: updateBody },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedManufacturer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Manufacture>}
 */
const deleteManufactureById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Update visibility settings for a manufacturer's profile based on payload
 * @param {ObjectId} manufactureId
 * @param {Object} payload
 * @returns {Promise<Manufacture>}
 */
const updateVisibilitySettings = async (manufactureId, payload) => {
  const manufacture = await Manufacture.findById(manufactureId);
  if (!manufacture) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }

  // Map the payload fields to the visibilitySettings structure
  const visibilitySettings = {

    kycVerified: payload.kycVerified !== undefined ? payload.kycVerified : manufacture.visibilitySettings.kycVerified,
    leagalStatusOfFirm: payload.leagalStatusOfFirm !== undefined ? payload.leagalStatusOfFirm : manufacture.visibilitySettings.leagalStatusOfFirm,
    logo: payload.logo !== undefined ? payload.logo : manufacture.visibilitySettings.logo,
    file: payload.file !== undefined ? payload.file : manufacture.visibilitySettings.file,
    fileName: payload.fileName !== undefined ? payload.fileName : manufacture.visibilitySettings.fileName,
    profileImg: payload.profileImg !== undefined ? payload.profileImg : manufacture.visibilitySettings.profileImg,
    fullName: payload.fullName !== undefined ? payload.fullName : manufacture.visibilitySettings.fullName,
    companyName: payload.companyName !== undefined ? payload.companyName : manufacture.visibilitySettings.companyName,
    email: payload.email !== undefined ? payload.email : manufacture.visibilitySettings.email,
    address: payload.address !== undefined ? payload.address : manufacture.visibilitySettings.address,
    state: payload.state !== undefined ? payload.state : manufacture.visibilitySettings.state,
    introduction: payload.introduction !== undefined ? payload.introduction : manufacture.visibilitySettings.introduction,
    city: payload.city !== undefined ? payload.city : manufacture.visibilitySettings.city,
    country: payload.country !== undefined ? payload.country : manufacture.visibilitySettings.country,
    pinCode: payload.pinCode !== undefined ? payload.pinCode : manufacture.visibilitySettings.pinCode,
    mobNumber: payload.mobNumber !== undefined ? payload.mobNumber : manufacture.visibilitySettings.mobNumber,
    mobNumber2: payload.mobNumber2 !== undefined ? payload.mobNumber2 : manufacture.visibilitySettings.mobNumber2,
    email2: payload.email2 !== undefined ? payload.email2 : manufacture.visibilitySettings.email2,
    GSTIN: payload.GSTIN !== undefined ? payload.GSTIN : manufacture.visibilitySettings.GSTIN,
    pan: payload.pan !== undefined ? payload.pan : manufacture.visibilitySettings.pan,
    code: payload.code !== undefined ? payload.code : manufacture.visibilitySettings.code,
    establishDate: payload.establishDate !== undefined ? payload.establishDate : manufacture.visibilitySettings.establishDate,
    turnover: payload.turnover !== undefined ? payload.turnover : manufacture.visibilitySettings.turnover,
    registerOnFTH: payload.registerOnFTH !== undefined ? payload.registerOnFTH : manufacture.visibilitySettings.registerOnFTH,
    delingInView: payload.delingInView !== undefined ? payload.delingInView : manufacture.visibilitySettings.delingInView,
    // Social Media fields
    'socialMedia.facebook': payload.socialMedia?.facebook !== undefined ? payload.socialMedia.facebook : manufacture.visibilitySettings['socialMedia.facebook'],
    'socialMedia.instagram': payload.socialMedia?.instagram !== undefined ? payload.socialMedia.instagram : manufacture.visibilitySettings['socialMedia.instagram'],
    'socialMedia.linkedIn': payload.socialMedia?.linkedIn !== undefined ? payload.socialMedia.linkedIn : manufacture.visibilitySettings['socialMedia.linkedIn'],
    'socialMedia.webSite': payload.socialMedia?.webSite !== undefined ? payload.socialMedia.webSite : manufacture.visibilitySettings['socialMedia.webSite'],

    // Bank Details fields
    'BankDetails.accountNumber': payload.BankDetails?.accountNumber !== undefined ? payload.BankDetails.accountNumber : manufacture.visibilitySettings['BankDetails.accountNumber'],
    'BankDetails.accountType': payload.BankDetails?.accountType !== undefined ? payload.BankDetails.accountType : manufacture.visibilitySettings['BankDetails.accountType'],
    'BankDetails.bankName': payload.BankDetails?.bankName !== undefined ? payload.BankDetails.bankName : manufacture.visibilitySettings['BankDetails.bankName'],
    'BankDetails.IFSCcode': payload.BankDetails?.IFSCcode !== undefined ? payload.BankDetails.IFSCcode : manufacture.visibilitySettings['BankDetails.IFSCcode'],
    'BankDetails.swiftCode': payload.BankDetails?.swiftCode !== undefined ? payload.BankDetails.swiftCode : manufacture.visibilitySettings['BankDetails.swiftCode'],
    'BankDetails.country': payload.BankDetails?.country !== undefined ? payload.BankDetails.country : manufacture.visibilitySettings['BankDetails.country'],
    'BankDetails.city': payload.BankDetails?.city !== undefined ? payload.BankDetails.city : manufacture.visibilitySettings['BankDetails.city'],
    'BankDetails.branch': payload.BankDetails?.branch !== undefined ? payload.BankDetails.branch : manufacture.visibilitySettings['BankDetails.branch'],

    isActive: payload.isActive !== undefined ? payload.isActive : manufacture.visibilitySettings.isActive,
  };

  // Update visibility settings
  manufacture.visibilitySettings = { ...manufacture.visibilitySettings, ...visibilitySettings };
  await manufacture.save();
  return manufacture;
};


/**
 * Get the visible profile for a manufacturer
 * @param {ObjectId} manufactureId
 * @returns {Promise<Object>}
 */

const getVisibleProfile = async (manufactureId) => {
  // Fetch the manufacturer by ID
  const manufacture = await Manufacture.findById(manufactureId);

  // If the manufacturer is not found, throw an error
  if (!manufacture) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }
  let uniqueProducts;
  if (manufacture.visibilitySettings.delingInView) {
    uniqueProducts = await ProductType2.find({ productBy: manufacture.email })
      .select('productType gender clothing subCategory')
      .lean(); // Use lean to get plain JavaScript objects

    // Remove duplicate objects based on 'productType', 'gender', 'category', and 'subCategory'
    const uniqueSet = new Set();
    uniqueProducts = uniqueProducts.filter((product) => {
      const uniqueKey = `${product.productType}-${product.gender}-${product.clothing}-${product.subCategory}`;
      if (!uniqueSet.has(uniqueKey)) {
        uniqueSet.add(uniqueKey);
        return true; // Include this product in the unique list
      }
      return false;
    });
  }
  // Return the manufacturer object along with the unique products
  return {
    ...manufacture.toObject(),
    uniqueProducts, // List of unique products
  };
};

module.exports = {
  createManufacture,
  queryManufacture,
  getManufactureById,
  getManufactureByEmail,
  getUserByEmail,
  fileupload,
  updateManufactureById,
  deleteManufactureById,
  getRetailersByEmail,
  updateVisibilitySettings,
  getVisibleProfile
};
