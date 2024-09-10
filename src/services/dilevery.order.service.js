const httpStatus = require('http-status');
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

const getGroupedProductsByStatus = async (customerEmail) => {
    const dileveryOrders = await DileveryOrder.find({
      'products.status': 'done',
      customerEmail,
    }).lean();

    // Step 2: Extract designNumber and productBy for products with "done" status
    const productDesignMap = {};
    dileveryOrders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.status === 'done') {
          const { designNo } = product;
          productDesignMap[designNo] = productDesignMap[designNo] || [];
          productDesignMap[designNo].push(order.companyEmail);
        }
      });
    });

    // Step 3: Query the Product collection based on designNumber and productBy
    const productPromises = Object.entries(productDesignMap).map(([designNumber, productByList]) => {
      return Product.find({
        designNumber,
        productBy: { $in: productByList },
      }).lean();
    });

    const products = await Promise.all(productPromises);

    // Step 4: Group products by `productBy`
    const groupedByProductBy = {};
    products.flat().forEach((product) => {
      const { productBy } = product;
      if (!groupedByProductBy[productBy]) {
        groupedByProductBy[productBy] = [];
      }
      groupedByProductBy[productBy].push(product);
    });

    return groupedByProductBy;
}

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
  const user = await getDileveryOrderById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};


const updateStatus = async (orderId, productId, status) => {
        const result = await DileveryOrder.findOneAndUpdate(
            { _id: orderId, 'products._id': productId },
            { $set: { 'products.$.status': status } },
            { new: true }
        );

        if (!result) {
          throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder or Product not found' );
        }
        return result;
}

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
  updateStatus,
  getGroupedProductsByStatus,
  getDileveryOrderBycustomerEmail,
  getDileveryOrderById,
  updateDileveryOrderById,
  deleteDileveryOrderById,
};
