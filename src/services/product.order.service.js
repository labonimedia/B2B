const httpStatus = require('http-status');
const { ProductOrder, Wholesaler } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Material
 * @param {Object} reqBody
 * @returns {Promise<Material>}
 */
const createProductOrder = async (reqBody) => {
  return ProductOrder.create(reqBody);
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
const queryProductOrder = async (filter, options) => {
  const material = await ProductOrder.paginate(filter, options);
  return material;
};

/**
 * Get Material by id
 * @param {ObjectId} id
 * @returns {Promise<Material>}
 */
const getProductOrderById = async (id) => {
  return ProductOrder.findById(id);
};

/**
 * Get Material by id
 * @param {email} supplierEmail
 * @returns {Promise<Material>}
 */
const getProductOrderBySupplyer = async (supplierEmail) => {
  const productOrders = await ProductOrder.find({ supplierEmail });
  
  if (productOrders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Product Orders found for this supplier');
  }
  const companyEmails = productOrders.map(order => order.companyEmail);
  const wholesalers = await Wholesaler.find({
    'discountGiven.discountGivenBy': { $in: companyEmails }  // Find discounts given by those companyEmails
  });

  if (wholesalers.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No wholesalers found with matching discounts');
  }
  return wholesalers.map(wholesaler => ({
    wholesalerName: wholesaler.fullName,
    companyName: wholesaler.companyName,
    discounts: wholesaler.discountGiven.filter(discount => companyEmails.includes(discount.discountGivenBy)),
    productOrders,
  }));
};

/**
 * Update Material by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Material>}
 */
const updateProductOrderById = async (id, updateBody) => {
  const user = await getMaterialById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrder not found');
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
const deleteProductOrderById = async (id) => {
  const user = await getProductOrderById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrder not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createProductOrder,
  queryProductOrder,
  getProductOrderById,
  getProductOrderBySupplyer,
  updateProductOrderById,
  deleteProductOrderById,
};
