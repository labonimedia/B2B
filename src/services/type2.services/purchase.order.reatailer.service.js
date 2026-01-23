const httpStatus = require('http-status');
const {
  PurchaseOrderRetailerType2,
  RetailerCartType2,
  Manufacture,
  PurchaseOrderType2,
  Wholesaler,
  Retailer,
} = require('../../models');
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
  await RetailerCartType2.findOneAndDelete({ email, productBy });
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

const getPurchaseOrderRetailerType2ByIdWithDiscount = async (id) => {
  const purchaseOrder = await PurchaseOrderRetailerType2.findById(id).lean();
  let discountDetails;
  // Fetch wholesaler details and discount array
  let retailer = await Retailer.findOne({
    email: purchaseOrder.retailer.email,
  })
    .select('discountGiven')
    .lean();

  if (retailer) {
    // Find the discount entry for the `productBy` field
    const discountEntry = retailer.discountGiven.find(
      (discount) => discount.discountGivenBy === purchaseOrder.wholesaler.email
    );

    if (discountEntry) {
      discountDetails = {
        productDiscount: discountEntry.productDiscount,
        category: discountEntry.category,
      };
    }
  }
  return {
    ...purchaseOrder,
    retailer: {
      ...purchaseOrder.retailer,
      discountDetails: discountDetails ?? null,
    },
  };
};

const getProductOrderBySupplyer = async (supplierEmail) => {
  const productOrders = await PurchaseOrderRetailerType2.find({ supplierEmail });

  if (productOrders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Product Orders found for this supplier');
  }

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

const combinePurchaseOrders = async (wholesalerEmail) => {
  if (!wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler email is required.');
  }

  const retailerPOs = await PurchaseOrderRetailerType2.find({
    wholesalerEmail,
    statusAll: 'pending',
  }).lean();

  if (!retailerPOs.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found.');
  }

  // Group items by productBy
  const groupedByProduct = {};
  retailerPOs.forEach((po) => {
    po.set.forEach((item) => {
      if (item.status === 'pending' && item.productBy) {
        const key = item.productBy;
        if (!groupedByProduct[key]) {
          groupedByProduct[key] = [];
        }
        // Exclude wholesaler from each set item.
        groupedByProduct[key].push({
          ...item,
          retailerPoId: po._id,
          poEmail: po.email,
          poNumber: po.poNumber,
        });
      } else if (!item.productBy) {
        console.warn(`Missing productBy for item in PO ${po._id}`);
      }
    });
  });

  // Fetch the wholesaler information once.
  const wholesalerData = await Wholesaler.findOne({ email: wholesalerEmail }).select(
    'email fullName companyName address state country pinCode profileImg mobNumber GSTIN'
  );

  const combinedPOs = (
    await Promise.all(
      Object.keys(groupedByProduct).map(async (productBy) => {
        const poGroup = groupedByProduct[productBy];

        // Merge items with the same designNumber, colour, size and retailer order.
        const setMap = new Map();
        poGroup.forEach((item) => {
          // Remove wholesaler if exists
          const { wholesaler, ...sanitizedItem } = item;
          // Include retailer order info in the key.
          const key = `${sanitizedItem.designNumber}_${sanitizedItem.colour}_${sanitizedItem.size}_${sanitizedItem.poEmail}_${sanitizedItem.poNumber}`;
          if (setMap.has(key)) {
            setMap.get(key).quantity += sanitizedItem.quantity;
          } else {
            setMap.set(key, sanitizedItem);
          }
        });
        const mergedSet = Array.from(setMap.values());

        // Get unique retailer PO info
        const uniqueRetailerPOsMap = new Map();
        poGroup.forEach((item) => {
          const key = `${item.poEmail}-${item.poNumber}`;
          if (!uniqueRetailerPOsMap.has(key)) {
            uniqueRetailerPOsMap.set(key, {
              email: item.poEmail,
              poNumber: item.poNumber,
            });
          }
        });
        const retailerPOsArray = Array.from(uniqueRetailerPOsMap.values());

        const manufacturer = await Manufacture.findOne({ email: productBy }).select(
          'email fullName companyName address state country pinCode mobNumber GSTIN logo discountGiven'
        );
        if (!manufacturer) {
          console.warn(`Manufacturer details not found for productBy: ${productBy}`);
          return null;
        }

        let discounts = [];
        if (wholesalerData) {
          discounts = wholesalerData.discountGiven?.filter((discount) => discount.discountGivenBy === productBy);
        }

        return {
          set: mergedSet,
          email: wholesalerEmail,
          productBy,
          retailerPOs: retailerPOsArray,
          wholesaler: wholesalerData,
          manufacturer,
          discounts,
        };
      })
    )
  ).filter(Boolean); // Remove null entries

  return combinedPOs;
};

const combinePurchaseOrdersForManufacturer = async (wholesalerEmail, manufacturerEmail) => {
  if (!wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler email is required.');
  }
  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Manufacturer email is required.');
  }

  // Step 1: Fetch purchase orders by wholesalerEmail and filter by manufacturerEmail in set items.
  const retailerPOs = await PurchaseOrderRetailerType2.find({
    wholesalerEmail,
    statusAll: 'pending',
    'set.productBy': manufacturerEmail,
  }).lean();

  if (!retailerPOs.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Order not found.');
  }

  const mergedItemsMap = new Map();
  const uniqueRetailerPOsMap = new Map();

  retailerPOs.forEach((po) => {
    const retailerKey = `${po.email}-${po.poNumber}`;
    if (!uniqueRetailerPOsMap.has(retailerKey)) {
      uniqueRetailerPOsMap.set(retailerKey, {
        email: po.email,
        poNumber: po.poNumber,
      });
    }
    po.set.forEach((item) => {
      if (item.productBy === manufacturerEmail) {
        // Create a merge key that includes the retailer's email and PO number.
        const mergeKey = `${item.designNumber}_${item.colour}_${item.size}_${po.email}_${po.poNumber}`;
        if (mergedItemsMap.has(mergeKey)) {
          mergedItemsMap.get(mergeKey).quantity += item.quantity;
        } else {
          mergedItemsMap.set(mergeKey, {
            ...item,
            retailerPoId: po._id,
            poEmail: po.email,
            poNumber: po.poNumber,
          });
        }
      }
    });
  });
  const mergedSet = Array.from(mergedItemsMap.values());
  const retailerPOsArray = Array.from(uniqueRetailerPOsMap.values());

  // Step 3: Determine the next PO number (assuming PurchaseOrderType2 tracks this).
  const lastPO = await PurchaseOrderType2.findOne({ email: wholesalerEmail }).sort({ poNumber: -1 }).lean();
  let nextPoNumber = lastPO ? lastPO.poNumber + 1 : 1;

  // Step 4: Fetch manufacturer details.
  const manufacturer = await Manufacture.findOne({ email: manufacturerEmail }).select(
    'email fullName companyName address state country pinCode mobNumber GSTIN logo discountGiven'
  );
  if (!manufacturer) {
    throw new ApiError(httpStatus.NOT_FOUND, `Manufacturer details not found for: ${manufacturerEmail}`);
  }

  const wholesaler = await Wholesaler.findOne({ email: wholesalerEmail }).select(
    'email fullName companyName address state country pinCode profileImg mobNumber GSTIN discountGiven'
  );

  const discounts = wholesaler?.discountGiven?.filter((discount) => discount.discountGivenBy === manufacturerEmail) || [];

  const combinedPO = {
    set: mergedSet,
    email: wholesalerEmail,
    productBy: manufacturerEmail,
    poNumber: nextPoNumber,
    discounts,
    retailerPOs: retailerPOsArray,
    wholesaler: wholesaler || {},
    manufacturer,
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
  getPurchaseOrderRetailerType2ByIdWithDiscount,
  updatePurchaseOrderRetailerType2ById,
  deletePurchaseOrderRetailerType2ById,
  deleteCartType2ById,
  getPurchaseOrdersByManufactureEmail,
};
