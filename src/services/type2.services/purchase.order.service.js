const httpStatus = require('http-status');
const { PurchaseOrderType2, CartType2, PurchaseOrderRetailerType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderType2>>}
 */
// const createPurchaseOrderType2 = async (reqBody) => {
//   const { email, productBy, retailerPOs } = reqBody;

//   // Validate that required fields are provided
//   if (!email || !productBy) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Both 'email' and 'productBy' are required.");
//   }

//   if (!Array.isArray(retailerPOs) || retailerPOs.length === 0) {
//     // throw new ApiError(httpStatus.BAD_REQUEST, "'poNumber' and valid 'retailerPOs' are required.");


//   }

//   // Create a new purchase order using the provided request body
//   const purchaseOrder = await PurchaseOrderType2.create(reqBody);

//   if (!purchaseOrder) {
//     throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create the purchase order.");
//   }

//   // Update the status of each retailer's purchase order in the array to 'processing'
//   for (const retailerPO of retailerPOs) {
//     const retailerOrder = await PurchaseOrderRetailerType2.findOne({ email: retailerPO.email, poNumber: retailerPO.poNumber });

//     if (!retailerOrder) {
//       throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Retailer purchase order not found.");
//     }

//     // Update the status in the `set` array where `designNumber` matches
//     retailerOrder.set.forEach((item) => {
//       if (reqBody.set.some((reqItem) => reqItem.designNumber === item.designNumber)) {
//         item.status = 'processing';
//       }
//     });

//     // Save the updated retailer order
//     await retailerOrder.save();
//   }

//   // Return the newly created purchase order
//   return purchaseOrder;
// };



const createPurchaseOrderType2 = async (reqBody) => {
  const { email, productBy, retailerPOs } = reqBody;
  // Validate that required fields are provided
  if (!email || !productBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Both 'email' and 'productBy' are required.");
  }

  let createdPurchaseOrder;

  if (!Array.isArray(retailerPOs) || retailerPOs.length === 0) {
    // Handle case where `retailerPOs` is not provided
    console.warn("'retailerPOs' not provided. Creating purchase order without retailer-specific processing.");

    // Create a purchase order without processing `retailerPOs`
    createdPurchaseOrder = await PurchaseOrderType2.create(reqBody);
  } else {
    // Handle case where `retailerPOs` are provided
    // Create a new purchase order using the provided request body
    createdPurchaseOrder = await PurchaseOrderType2.create(reqBody);

    if (!createdPurchaseOrder) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create the purchase order.");
    }

    // Update the status of each retailer's purchase order in the array to 'processing'
    for (const retailerPO of retailerPOs) {
      const retailerOrder = await PurchaseOrderRetailerType2.findOne({
        email: retailerPO.email,
        poNumber: retailerPO.poNumber
      });

      if (!retailerOrder) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Retailer purchase order not found.");
      }

      // Update the status in the `set` array where `designNumber` matches
      retailerOrder.set.forEach((item) => {
        if (reqBody.set.some((reqItem) => reqItem.designNumber === item.designNumber)) {
          item.status = 'processing';
        }
      });

      // Save the updated retailer order
      await retailerOrder.save();
    }
  }

  // Return the newly created purchase order
  return createdPurchaseOrder;
};


const deleteCartType2ById = async (email, productBy) => {
  const purchaseOrderType2 = await CartType2.findOneAndDelete({ email, productBy });
  if (!purchaseOrderType2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found');
  }
  return purchaseOrderType2;
};

/**
 * Query for PurchaseOrderType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPurchaseOrderType2 = async (filter, options) => {
  const purchaseOrderType2Items = await PurchaseOrderType2.paginate(filter, options);
  return purchaseOrderType2Items;
};

/**
 * Get PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const getPurchaseOrderType2ById = async (id) => {
  return PurchaseOrderType2.findById(id);
};

const getProductOrderBySupplyer = async (supplierEmail) => {
  const productOrders = await PurchaseOrderType2.find({ productBy: supplierEmail });

  if (productOrders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Product Orders found for this supplier');
  }

  // const companyEmails = productOrders.map((order) => order.supplierEmail);
  // // const wholesalers = await Wholesaler.find({
  // //   'discountGiven.discountGivenBy': { $in: companyEmails },
  // // });

  // const updatedProductOrders = productOrders.map((order) => {
  //   const matchedWholesaler = wholesalers.find((wholesaler) =>
  //     wholesaler.discountGiven.some((discount) => discount.discountGivenBy === order.supplierEmail)
  //   );

  //   const discounts = matchedWholesaler
  //     ? matchedWholesaler.discountGiven.filter((discount) => discount.discountGivenBy === order.supplierEmail)
  //     : [];

  //   return {
  //     ...order.toObject(),
  //     discounts, // This will be an empty array if no discounts were found
  //   };
  // });

  return productOrders;
};

/**
 * Update PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderType2>}
 */
const updatePurchaseOrderType2ById = async (id, updateBody) => {
  const cart = await getPurchaseOrderType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete PurchaseOrderType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderType2>}
 */
const deletePurchaseOrderType2ById = async (id) => {
  const cart = await getPurchaseOrderType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  await cart.remove();
  return cart;
};

const getPurchaseOrdersByManufactureEmail = async (manufacturerEmail, filter, options) => {
  const query = { 'manufacturer.email': manufacturerEmail };

  // Apply additional filters
  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.assign(query, parsedFilter);
  }

  // Use Mongoose paginate plugin
  const result = await PurchaseOrderType2.paginate(query, {
    ...options,
    customLabels: { docs: 'purchaseOrders' }, // Rename `docs` to `purchaseOrders` in response
  });

  return result;
};
// Create combined PO for wholesaler
module.exports = {
  createPurchaseOrderType2,
  queryPurchaseOrderType2,
  getProductOrderBySupplyer,
  getPurchaseOrderType2ById,
  updatePurchaseOrderType2ById,
  deletePurchaseOrderType2ById,
  deleteCartType2ById,
  getPurchaseOrdersByManufactureEmail,
};
