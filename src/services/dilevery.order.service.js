const httpStatus = require('http-status');
const { DileveryOrder, Manufacture, ChallanCounter, Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Material
 * @param {Object} reqBody
 * @returns {Promise<Material>}
 */

// const createDileveryOrder = async (reqBody) => {
//   // Start a session to ensure transactional consistency
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Create the delivery order
//     const newOrder = await DileveryOrder.create([reqBody], { session });

//     // Loop through each product in the order and update the product quantity in the Product collection
//     for (const orderedProduct of reqBody.products) {
//       const product = await Product.findOne({ designNumber: orderedProduct.designNo, productBy: reqBody.companyEmail,  }).session(session);

//       if (!product) {
//         throw new ApiError(httpStatus.NOT_FOUND, `Product with design number ${orderedProduct.designNo} not found`);
//       }

//       // Check if there's enough stock to fulfill the order
//       if (product.quantity < orderedProduct.qty) {
//         throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient quantity for product: ${orderedProduct.designNo}`);
//       }

//       // Reduce the stock by the ordered quantity
//       product.quantity -= orderedProduct.qty;
//       await product.save({ session });
//     }

//     // Commit the transaction after successfully updating product quantities and creating the order
//     await session.commitTransaction();
//     session.endSession();

//     return newOrder[0];
//   } catch (error) {
//     // Roll back the transaction in case of any errors
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

const createDileveryOrder = async (reqBody) => {
  try {
    // Create the delivery order
    const newOrder = await DileveryOrder.create(reqBody);

    // Loop through each product in the order and update the product quantity in the Product collection
    for (const orderedProduct of reqBody.products) {
      const product = await Product.findOne({
        designNumber: orderedProduct.designNo,
        productBy: reqBody.companyEmail,
      });

      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, `Product with design number ${orderedProduct.designNo} not found`);
      }

      if (product.quantity < orderedProduct.qty) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient quantity for product: ${orderedProduct.designNo}`);
      }

      product.quantity -= orderedProduct.qty;
      await product.save();
    }

    return newOrder;
  } catch (error) {
    throw error;
  }
};

// const createDileveryOrder = async (reqBody) => {

//   return DileveryOrder.create(reqBody);
// };

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
  // Step 1: Fetch delivery orders with 'done' status products
  const deliveryOrders = await DileveryOrder.find({
    'products.status': 'done',
    // productStatus: 'pending',
    customerEmail,
  }).lean();

  const productDesignMap = {};

  // Step 2: Build a map of design numbers to manufacturer emails (companyEmail)
  deliveryOrders.forEach((order) => {
    order.products.forEach((product) => {
      if (product.status === 'done') {
        const { designNo } = product;
        productDesignMap[designNo] = productDesignMap[designNo] || [];
        productDesignMap[designNo].push(order.companyEmail); // Push manufacturer email (companyEmail)
      }
    });
  });

  // Step 3: Query the Product collection based on designNumber and manufacturer emails
  const productPromises = Object.entries(productDesignMap).map(async ([designNumber, productByList]) => {
    // Fetch matching products from Product collection
    const products = await Product.find({
      designNumber,
      productBy: { $in: productByList },
    }).lean();

    // Fetch fullName of manufacturers from the Manufacturer collection
    const manufacturers = await Manufacture.find({
      email: { $in: productByList }, // Assuming email is the identifier in Manufacturer collection
    }).lean();

    // Create a map for manufacturer emails to fullName
    const manufacturerMap = {};
    manufacturers.forEach((manufacturer) => {
      manufacturerMap[manufacturer.email] = manufacturer.fullName;
    });

    // Return each product with fullName of the manufacturer
    return products.map((product) => ({
      ...product,
      manufacturerFullName: manufacturerMap[product.productBy], // Assuming productBy holds the email
    }));
  });

  // Step 4: Resolve all promises to get the list of products
  const products = await Promise.all(productPromises);

  // Step 5: Group delivery order products with 'done' status by `manufacturerFullName`
  const groupedByManufacturer = {};

  // Flatten the array of arrays
  products.flat().forEach((product) => {
    const { manufacturerFullName } = product;
    if (!groupedByManufacturer[manufacturerFullName]) {
      groupedByManufacturer[manufacturerFullName] = [];
    }
    groupedByManufacturer[manufacturerFullName].push(product);
  });
  // Step 6: Combine delivery order data with matching product details
  const result = [];
  deliveryOrders.forEach((order) => {
    order.products.forEach((product) => {
      if (product.status === 'done') {
        const { designNo } = product;
        // Find matching products for the same designNo
        const matchingProducts = products.flat().filter((p) => p.designNumber === designNo);
        // Include both the delivery order product and the matching products
        result.push({
          deliveryProduct: product,
          matchingProducts,
          orderDetails: {
            companyEmail: order.companyEmail,
            orderId: order._id,
          },
        });
      }
    });
  });

  return result;
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
    throw new ApiError(httpStatus.NOT_FOUND, 'DileveryOrder or Product not found');
  }
  return result;
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
  updateStatus,
  getGroupedProductsByStatus,
  getDileveryOrderBycustomerEmail,
  getDileveryOrderById,
  updateDileveryOrderById,
  deleteDileveryOrderById,
};
