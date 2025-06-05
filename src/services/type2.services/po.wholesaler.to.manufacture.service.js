const httpStatus = require('http-status');
const { POWholesalerToManufacturer, RetailerCartType2, PORetailerToWholesaler } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Get POWholesalerToManufacturer by id
 * @param {ObjectId} id
 * @returns {Promise<POWholesalerToManufacturer>}
 */
const getSinglePOWholesalerToManufacturer = async (id) => {
    return POWholesalerToManufacturer.findById(id);
  };
  const createPoToManufacturer = async (wholesalerEmail, payload) => {
    const poIds = [];
  
    for (const [manufacturerEmail, setItems] of Object.entries(payload)) {
      const newPO = new POWholesalerToManufacturer({
        wholesalerEmail,
        manufacturerEmail,
        set: setItems.map((item) => {
          delete item.productBy;
          return item;
        }),
        createdFromRetailerPoIds: [...new Set(setItems.flatMap(item => item.retailerPoLinks.map(link => link.poId)))]
      });
  
      await newPO.save();
      poIds.push(newPO._id);
  
      // Update each retailer PO
      for (const item of setItems) {
        for (const link of item.retailerPoLinks) {
          await PORetailerToWholesaler.updateOne(
            { _id: link.poId, 'set._id': link.setItemId },
            {
              $set: {
                'set.$.status': 'processing',
                'set.$.availableQuantity': link.quantity
              }
            }
          );
        }
      }
    }
  
    return { message: 'POs created successfully', poIds };
  };
/**
 * Create Retailer PO and remove matching cart entry
 */
const createPurchaseOrderRetailerType2 = async (reqBody) => {
    const { cartId } = reqBody;

    if (!cartId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "'cartId' is required.");
    }
    
    await RetailerCartType2.findByIdAndDelete({_id:cartId});

  const purchaseOrder = await POWholesalerToManufacturer.create(reqBody);
  return purchaseOrder;
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
const getAllPOWholesalerToManufacturer = async (filter, options) => {
  const pOWholesalerToManufacturer = await POWholesalerToManufacturer.paginate(filter, options);
  return pOWholesalerToManufacturer;
};

/**
 * Wholesaler views retailer POs
 */
const getRetailerPOByWholesaler = async (wholesalerEmail) => {
  return POWholesalerToManufacturer.find({ wholesalerEmail }).sort({ createdAt: -1 });
};

/**
 * Wholesaler updates a specific set item in the PO
 */
const updateRetailerPOSetItem = async (poId, updateBody) => {
  const { designNumber, colour, size, updatedFields } = updateBody;

  const po = await POWholesalerToManufacturer.findById(poId);
  if (!po) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');

  const item = po.set.find(
    (item) =>
      item.designNumber === designNumber &&
      item.colour === colour &&
      item.size === size
  );

  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found in PO');

  Object.keys(updatedFields).forEach((key) => {
    item[key] = updatedFields[key];
  });

  await po.save();
  return po;
};



/**
 * Update POWholesalerToManufacturer by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<POWholesalerToManufacturer>}
 */
const updateSinglePOWholesalerToManufacturer = async (id, updateBody) => {
    const cart = await getSinglePOWholesalerToManufacturer(id);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    Object.assign(cart, updateBody);
    await cart.save();
    return cart;
  };
  
  /**
   * Delete POWholesalerToManufacturer by id
   * @param {ObjectId} id
   * @returns {Promise<POWholesalerToManufacturer>}
   */
  const deleteSinglePOWholesalerToManufacturer = async (id) => {
    const cart = await getSinglePOWholesalerToManufacturer(id);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    await cart.remove();
    return cart;
  };

//   const combinePendingRetailerPOItems = async (wholesalerEmail) => {
//     const allRetailerPOs = await PORetailerToWholesaler.find({
//       wholesalerEmail,
//       statusAll: 'pending',
//       'set.status': 'pending',
//     });
  
//     const combinedMap = new Map();
  
//     for (const po of allRetailerPOs) {
//       for (const setItem of po.set) {
//         if (setItem.status !== 'pending') continue;
  
//         const key = `${setItem.productBy}|${setItem.designNumber}|${setItem.colour}|${setItem.size}`;
  
//         const existing = combinedMap.get(key) || {
//           designNumber: setItem.designNumber,
//           colour: setItem.colour,
//           colourName: setItem.colourName,
//           size: setItem.size,
//           totalQuantity: 0,
//           clothing: setItem.clothing,
//           gender: setItem.gender,
//           subCategory: setItem.subCategory,
//           productType: setItem.productType,
//           price: setItem.price,
//           manufacturerPrice: setItem.manufacturerPrice,
//           retailerPoLinks: [],
//           productBy: setItem.productBy
//         };
  
//         existing.totalQuantity += setItem.quantity;
//         existing.retailerPoLinks.push({
//           poId: po._id,
//           setItemId: setItem._id,
//           quantity: setItem.quantity,
//         });
  
//         combinedMap.set(key, existing);
//       }
//     }
  
//     // Group by manufacturer email (productBy)
//     const groupedByManufacturer = {};
//     for (const item of combinedMap.values()) {
//       const manufacturer = item.productBy;
//       if (!groupedByManufacturer[manufacturer]) {
//         groupedByManufacturer[manufacturer] = [];
//       }
//       groupedByManufacturer[manufacturer].push(item);
//     }
  
//     return groupedByManufacturer;
//   };
const combinePendingRetailerPOItems = async (wholesalerEmail) => {
    const allRetailerPOs = await PORetailerToWholesaler.find({
      wholesalerEmail,
      statusAll: 'pending',
      'set.status': 'pending',
    });
  
    const combinedMap = new Map();
  
    for (const po of allRetailerPOs) {
      for (const setItem of po.set) {
        if (setItem.status !== 'pending') continue;
  
        const key = `${setItem.productBy}|${setItem.designNumber}|${setItem.colour}|${setItem.size}`;
  
        const existing = combinedMap.get(key) || {
          designNumber: setItem.designNumber,
          colour: setItem.colour,
          colourName: setItem.colourName,
          size: setItem.size,
          totalQuantity: 0,
          clothing: setItem.clothing,
          gender: setItem.gender,
          subCategory: setItem.subCategory,
          productType: setItem.productType,
          price: setItem.price,
          manufacturerPrice: setItem.manufacturerPrice,
          retailerPoLinks: [],
          productBy: setItem.productBy
        };
  
        existing.totalQuantity += setItem.quantity;
        existing.retailerPoLinks.push({
          poId: po._id,
          setItemId: setItem._id,
          quantity: setItem.quantity,
        });
  
        combinedMap.set(key, existing);
      }
    }
  
    // Convert map to grouped array
    const manufacturerMap = new Map();
  
    for (const item of combinedMap.values()) {
      const manufacturerEmail = item.productBy;
      if (!manufacturerMap.has(manufacturerEmail)) {
        manufacturerMap.set(manufacturerEmail, []);
      }
      manufacturerMap.get(manufacturerEmail).push(item);
    }
  
    const resultArray = [];
  
    for (const [manufacturerEmail, set] of manufacturerMap.entries()) {
      resultArray.push({ manufacturerEmail, set });
    }
  
    return resultArray; // Final format as array
  };
  
module.exports = {
  createPurchaseOrderRetailerType2,
  getRetailerPOByWholesaler,
  updateRetailerPOSetItem,
  getAllPOWholesalerToManufacturer,
  updateSinglePOWholesalerToManufacturer,
  deleteSinglePOWholesalerToManufacturer,
  getSinglePOWholesalerToManufacturer,
  combinePendingRetailerPOItems,
  createPoToManufacturer,
};
