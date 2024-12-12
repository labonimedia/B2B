const httpStatus = require('http-status');
const { PurchaseOrderRetailerType2, RetailerCartType2, POCountertype2, Manufacture, PurchaseOrderType2, Wholesaler } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple PurchaseOrderRetailerType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<PurchaseOrderRetailerType2>>}
 */
const createPurchaseOrderRetailerType2 = async (reqBody) => {
  const { email, productBy } = reqBody;

  // Validate that `email` and `productBy` are provided
  if (!email || !productBy) {
    throw new ApiError(httpStatus.NOT_FOUND, "Both 'email' and 'productBy' are required.");
  }

  // Find and delete the cart item(s) matching the given `email` and `productBy`
  await RetailerCartType2.findOneAndDelete({ email, productBy })
  // Create a new purchase order using the provided request body
  const purchaseOrder = await PurchaseOrderRetailerType2.create(reqBody);

  // Return the newly created purchase order
  return purchaseOrder;
};

const deleteCartType2ById = async (email, productBy) => {
  const PurchaseOrderRetailerType2 = await RetailerCartType2.findOneAndDelete({ email, productBy });
  if (!PurchaseOrderRetailerType2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found');
  }
  return PurchaseOrderRetailerType2;
};

/**
 * Query for PurchaseOrderRetailerType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPurchaseOrderRetailerType2 = async (filter, options) => {
  const PurchaseOrderRetailerType2Items = await PurchaseOrderRetailerType2.paginate(filter, options);
  return PurchaseOrderRetailerType2Items;
};

/**
 * Get PurchaseOrderRetailerType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderRetailerType2>}
 */
const getPurchaseOrderRetailerType2ById = async (id) => {
  return PurchaseOrderRetailerType2.findById(id);
};

const getProductOrderBySupplyer = async (supplierEmail) => {
  const productOrders = await PurchaseOrderRetailerType2.find({ supplierEmail });

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
 * Update PurchaseOrderRetailerType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PurchaseOrderRetailerType2>}
 */
const updatePurchaseOrderRetailerType2ById = async (id, updateBody) => {
  const cart = await getPurchaseOrderRetailerType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete PurchaseOrderRetailerType2 by id
 * @param {ObjectId} id
 * @returns {Promise<PurchaseOrderRetailerType2>}
 */
const deletePurchaseOrderRetailerType2ById = async (id) => {
  const cart = await getPurchaseOrderRetailerType2ById(id);
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
  const result = await PurchaseOrderRetailerType2.paginate(query, {
    ...options,
    customLabels: { docs: 'purchaseOrders' }, // Rename `docs` to `purchaseOrders` in response
  });

  return result;
};


// const PurchaseOrderRetailerType2 = require('../models/PurchaseOrderRetailerType2'); // Adjust path as needed

// const combinePurchaseOrders = async (wholesalerEmail) => {
const combinePurchaseOrders = async (wholesalerEmail) => {

  if (!wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler email is required.');
  }

  // Step 1: Fetch purchase orders by wholesalerEmail
  const retailerPOs = await PurchaseOrderRetailerType2.find({
    wholesalerEmail,
    status: 'pending',
  }).lean();

  if (!retailerPOs.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found.');
  }

  // Step 2: Sort and group by productBy
  const groupedByProduct = retailerPOs.reduce((acc, po) => {
    po.set.forEach((item) => {
      const key = item.productBy;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ ...item, retailerPoId: po._id }); // Include the PO ID for context
    });
    return acc;
  }, {});

  // Step 3: Get the last `poNumber` from the database
  const lastPO = await PurchaseOrderType2.findOne({ email: wholesalerEmail })
    .sort({ poNumber: -1 })
    .lean();
  let nextPoNumber = lastPO ? lastPO.poNumber + 1 : 1;

  // Step 4: Process each group and merge the 'set' arrays
  const combinedPOs = await Promise.all(
    Object.keys(groupedByProduct).map(async (productBy) => {
      const poGroup = groupedByProduct[productBy];

      // Merge 'set' arrays
      const mergedSet = [];
      const setMap = new Map(); // To track unique combinations

      poGroup.forEach((item) => {
        const key = `${item.designNumber}_${item.colour}_${item.size}`;
        if (setMap.has(key)) {
          // If the combination exists, add the quantity
          setMap.get(key).quantity += item.quantity;
        } else {
          // Add a new combination
          const { wholesaler, ...sanitizedItem } = item;
          setMap.set(key, { ...sanitizedItem });
        }
      });

      // Convert map to array
      setMap.forEach((value) => mergedSet.push(value));

      // Prepare retailerPOs array
      const retailerPOsArray = retailerPOs
        .filter((po) => po.set.some((s) => s.productBy === productBy))
        .map((po) => ({
          email: po.email,
          poNumber: po.poNumber,
        }));

      // Fetch manufacturer details for the productBy
      const manufacturer = await Manufacture.findOne({ email: productBy }).select(
        'email fullName companyName address state country pinCode mobNumber GSTIN logo discountGiven'
      );

      if (!manufacturer) {
        throw new ApiError(httpStatus.NOT_FOUND, `Manufacturer details not found for productBy: ${productBy}`);
      }
      const wholesaler = await Wholesaler.findOne({ email: wholesalerEmail });

      if (!wholesaler) {
        throw new Error('Wholesaler not found.');
      }

      // Filter discounts given by the specified productBy
      const discounts = wholesaler.discountGiven.filter(
        (discount) => discount.discountGivenBy === productBy
      );
      // Create a new PO number for this group
      const currentPoNumber = nextPoNumber;
      nextPoNumber += 1;

      // Return combined PO
      return {
        set: mergedSet,
        email: wholesalerEmail,
        productBy,
        poNumber: currentPoNumber,
        retailerPOs: retailerPOsArray,
        wholesaler: retailerPOs.find((po) => po.set.some((s) => s.productBy === productBy)).wholesaler,
        manufacturer,
        discounts: discounts || [],
      };
    })
  );

  // Step 5: Return combined POs
  return combinedPOs;
};
;



const combinePurchaseOrdersForManufacturer = async (wholesalerEmail, manufacturerEmail) => {
  if (!wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler email is required.');
  }

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Manufacturer email is required.');
  }

  // Step 1: Fetch purchase orders by wholesalerEmail
  const retailerPOs = await PurchaseOrderRetailerType2.find({
    wholesalerEmail,
    status: 'pending',
    'set.productBy': manufacturerEmail,
  }).lean();

  if (!retailerPOs.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found.');
  }
  // Step 2: Filter and group data for the specific manufacturer
  const groupedByProduct = retailerPOs.reduce((acc, po) => {
    po.set.forEach((item) => {
      if (item.productBy === manufacturerEmail) {
        const key = `${item.designNumber}_${item.colour}_${item.size}`;
        if (!acc[key]) {
          acc[key] = { ...item, retailerPoId: po._id, quantity: 0 };
        }
        acc[key].quantity += item.quantity;
      }
    });
    return acc;
  }, {});
  // Convert grouped data to an array
  const mergedSet = Object.values(groupedByProduct);

  // Prepare retailerPOs array
  const retailerPOsArray = retailerPOs.map((po) => ({
    email: po.email,
    poNumber: po.poNumber,
  }));

  // Fetch manufacturer details
  const manufacturer = await Manufacture.findOne({ email: manufacturerEmail }).select(
    'email fullName companyName address state country pinCode mobNumber GSTIN logo discountGiven'
  );

  if (!manufacturer) {
    throw new ApiError(httpStatus.NOT_FOUND, `Manufacturer details not found for: ${manufacturerEmail}`);
  }

  // Prepare and return combined PO
  const combinedPO = {
    set: mergedSet,
    email: wholesalerEmail,
    productBy: manufacturerEmail,
    cartAddedDate: new Date(),
    // poNumber: orderNumber, // Unique PO number for this manufacturer
    retailerPOs: retailerPOsArray,
    wholesaler: retailerPOs[0]?.wholesaler || {},
    manufacturer, // Include the manufacturer details
  };
  return combinedPO;
};


module.exports = {
  createPurchaseOrderRetailerType2,
  queryPurchaseOrderRetailerType2,
  getProductOrderBySupplyer,
  combinePurchaseOrders,
  combinePurchaseOrdersForManufacturer,
  getPurchaseOrderRetailerType2ById,
  updatePurchaseOrderRetailerType2ById,
  deletePurchaseOrderRetailerType2ById,
  deleteCartType2ById,
  getPurchaseOrdersByManufactureEmail,
};
