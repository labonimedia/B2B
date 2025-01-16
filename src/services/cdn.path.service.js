const httpStatus = require('http-status');
const { CDNPath } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a CDNPath
 * @param {Object} reqBody
 * @returns {Promise<CDNPath>}
 */
const createCDNPath = async (reqBody) => {
    const existingCDNPath = await CDNPath.findOne({ bucketName: reqBody.bucketName });
    if (existingCDNPath) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `CDNPath with name '${reqBody.name}' already exists`);
    }
    return CDNPath.create(reqBody);
};

/**
 * Query for CDNPath
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCDNPath = async (filter, options) => {
    const citys = await CDNPath.paginate(filter, options);
    return citys;
};

/**
 * Get CDNPath by id
 * @param {ObjectId} id
 * @returns {Promise<CDNPath>}
 */
const getCDNPathById = async (id) => {
    return CDNPath.findById(id);
};

/**
 * Update CDNPath by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<CDNPath>}
 */
const updateCDNPathById = async (id, updateBody) => {
    const user = await getCDNPathById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'CDNPath not found');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<CDNPath>}
 */
const deleteCDNPathById = async (id) => {
    const user = await getCDNPathById(id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'CDNPath not found');
    }
    await user.remove();
    return user;
};


module.exports = {
    createCDNPath,
    queryCDNPath,
    getCDNPathById,
    updateCDNPathById,
    deleteCDNPathById,
};
