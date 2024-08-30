const httpStatus = require('http-status');
const { Retailer } = require('../models');
const ApiError = require('../utils/ApiError');


const fileupload = async (req, id) => {
  // Find the document by ID
  const retailer = await Retailer.findById(id);

  if (!retailer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
 
  const extractPath = (url) => new URL(url).pathname;
  const file = req.body.file ? extractPath(req.body.file[0]) : null;
  const profileImg = req.body.profileImg ? extractPath(req.body.profileImg[0]) : null;
  const fileName = req.body.fileName || '';

  retailer.file = file;
  retailer.fileName = fileName;
  retailer.profileImg = profileImg;

  await retailer.save();
  return retailer;
};
/**
 * Create a Retailer
 * @param {Object} reqBody
 * @returns {Promise<Retailer>}
 */
const createRetailer = async (reqBody) => {
  return Retailer.create(reqBody);
};

/**
 * Query for Retailer
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRetailer = async (filter, options) => {
  const Retailers = await Retailer.paginate(filter, options);
  return Retailers;
};

/**
 * Get Retailer by id
 * @param {ObjectId} id
 * @returns {Promise<Retailer>}
 */
const getRetailerById = async (id) => {
  return Retailer.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Retailer>}
 */
const getUserByEmail = async (email) => {
  return Retailer.findOne({ email });
};

/**
 * Update Retailer by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Retailer>}
 */
const updateRetailerById = async (email, updateBody) => {
  console.log('updateBody',updateBody)
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Retailer>}
 */
const deleteRetailerById = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createRetailer,
  queryRetailer,
  getRetailerById,
  fileupload,
  getUserByEmail,
  updateRetailerById,
  deleteRetailerById,
};
