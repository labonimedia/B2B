const httpStatus = require('http-status');
const { profile } = require('winston');
const { DileveryOrder, Manufacture, ChallanCounter } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Material
 * @param {Object} reqBody
 * @returns {Promise<Material>}
 */
const createDileveryOrder = async (reqBody) => {
  return DileveryOrder.create(reqBody);
};

/**
 * Query for Material
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDileveryOrder = async (filter, options) => {
  const material = await DileveryOrder.paginate(filter, options);
  return material;
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getDileveryOrderById = async (id) => {
  return DileveryOrder.findById(id);
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getDileveryOrderBycustomerEmail = async (customerEmail) => {
  return DileveryOrder.find({ customerEmail });
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getManufactureChalanNo = async (email) => {
  // Find manufacture by email and select only the profileImg field
  const manufacture = await Manufacture.findOne({ email }).select('profileImg');

  if (!manufacture) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacture not found');
  }

  let challanCounter;
  try {
    // Increment the counter and upsert if not present
    challanCounter = await ChallanCounter.findOneAndUpdate(
      { email },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Handle potential errors (e.g., duplicate key)
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Duplicate order counter entry.');
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while updating the challan counter.');
  }

  return {
    profileImg: manufacture.profileImg,
    challanNo: challanCounter.count,
  };
};

/**
 * Update Material by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Material>}
 */
const updateDileveryOrderById = async (id, updateBody) => {
  const user = await getMaterialById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Material>}
 */
const deleteDileveryOrderById = async (id) => {
  const user = await getDileveryOrderById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createDileveryOrder,
  queryDileveryOrder,
  getManufactureChalanNo,
  getDileveryOrderBycustomerEmail,
  getDileveryOrderById,
  updateDileveryOrderById,
  deleteDileveryOrderById,
};
