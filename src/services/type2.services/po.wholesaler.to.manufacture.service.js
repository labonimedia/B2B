const httpStatus = require('http-status');
const { POWholesalerToManufacturer, RetailerCartType2, PORetailerToWholesaler, Wholesaler, Manufacture } = require('../../models');
const ApiError = require('../../utils/ApiError');
/**
 * Get POWholesalerToManufacturer by id
 * @param {ObjectId} id
 * @returns {Promise<POWholesalerToManufacturer>}
 */
const getSinglePOWholesalerToManufacturer = async (id) => {
    return POWholesalerToManufacturer.findById(id);
  };



// const createPoToManufacturer = async (wholesalerEmail, combinedPOData) => {
//     const createdPoIds = [];
  
//     for (const item of combinedPOData) {
//       const { manufacturerEmail, set } = item;
  
//       // ✅ Get last PO number for this wholesaler
//       const lastPo = await POWholesalerToManufacturer.findOne({ wholesalerEmail })
//         .sort({ poNumber: -1 })
//         .lean();
//       const poNumber = lastPo ? lastPo.poNumber + 1 : 1;
  
//       // ✅ Extract unique poIds from retailerPoLinks
//       const createdFromRetailerPoIds = [
//         ...new Set(set.flatMap((s) => s.retailerPoLinks.map((link) => link.poId)))
//       ];
  
//       // ✅ Create PO to Manufacturer
//       const newPO = new POWholesalerToManufacturer({
//         wholesalerEmail,
//         manufacturerEmail,
//         poNumber,
//         set: set.map((s) => {
//           const { productBy, price, ...rest } = s;
//           return {
//             ...rest,
//             manufacturerPrice: price, // Storing current price as manufacturerPrice
//             price,
//             availableQuantity: 0, // manufacturer will update later
//             status: 'pending'
//           };
//         }),
//         createdFromRetailerPoIds
//       });
  
//       await newPO.save();
//       createdPoIds.push(newPO._id);
  
//       // ✅ Update each referenced set in PORetailerToWholesaler
//       for (const s of set) {
//         for (const link of s.retailerPoLinks) {
//           await PORetailerToWholesaler.updateOne(
//             { _id: link.poId, 'set._id': link.setItemId },
//             {
//               $set: {
//                 'set.$.status': 'processing',
//                 'set.$.availableQuantity': link.quantity
//               }
//             }
//           );
//         }
//       }
  
//       // ✅ Update statusAll for each retailer PO
//       for (const poId of createdFromRetailerPoIds) {
//         await PORetailerToWholesaler.updateOne(
//           { _id: poId },
//           { $set: { statusAll: 'processing' } }
//         );
//       }
//     }
  
//     return {
//       message: 'POs to manufacturers created successfully',
//       createdPoIds
//     };
//   };

const createPoToManufacturer = async (wholesalerEmail, combinedPOData) => {
    const createdPoIds = [];
  
    for (const item of combinedPOData) {
      const { manufacturerEmail, set, wholesaler, manufacturer } = item;
  
      // ✅ Get last PO number for this wholesaler
      const lastPo = await POWholesalerToManufacturer.findOne({ wholesalerEmail })
        .sort({ poNumber: -1 })
        .lean();
      const poNumber = lastPo ? lastPo.poNumber + 1 : 1;
  
      // ✅ Extract unique poIds from retailerPoLinks
      const createdFromRetailerPoIds = [
        ...new Set(set.flatMap((s) => s.retailerPoLinks.map((link) => link.poId)))
      ];
  
      // ✅ Create PO to Manufacturer
      const newPO = new POWholesalerToManufacturer({
        wholesalerEmail,
        manufacturerEmail,
        poNumber,
        set: set.map((s) => {
          const { productBy, price, ...rest } = s;
          return {
            ...rest,
            manufacturerPrice: price,
            price,
            availableQuantity: 0,
            status: 'pending'
          };
        }),
        createdFromRetailerPoIds,
        wholesaler: {
          email: wholesaler.email,
          fullName: wholesaler.fullName,
          companyName: wholesaler.companyName,
          address: wholesaler.address,
          state: wholesaler.state,
          country: wholesaler.country,
          pinCode: wholesaler.pinCode,
          mobNumber: wholesaler.mobNumber,
          GSTIN: wholesaler.GSTIN,
          profileImg: wholesaler.profileImg,
          logo: wholesaler.logo,
          productDiscount: wholesaler.productDiscount,
          category: wholesaler.category
        },
        manufacturer: {
          email: manufacturer.email,
          fullName: manufacturer.fullName,
          companyName: manufacturer.companyName,
          address: manufacturer.address,
          state: manufacturer.state,
          profileImg: manufacturer.profileImg,
          logo: manufacturer.logo,
          country: manufacturer.country,
          pinCode: manufacturer.pinCode,
          mobNumber: manufacturer.mobNumber,
          GSTIN: manufacturer.GSTIN,
         
        },
        statusAll: 'pending'
      });
  
      await newPO.save();
      createdPoIds.push(newPO._id);
  
      // ✅ Update referenced set in PORetailerToWholesaler
      for (const s of set) {
        for (const link of s.retailerPoLinks) {
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
  
      // ✅ Update statusAll in retailer PO
      for (const poId of createdFromRetailerPoIds) {
        await PORetailerToWholesaler.updateOne(
          { _id: poId },
          { $set: { statusAll: 'processing' } }
        );
      }
    }
  
    return {
      message: 'POs to manufacturers created successfully',
      createdPoIds
    };
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



// const combinePendingRetailerPOItems = async (wholesalerEmail) => {
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
  
//     // Convert map to grouped array
//     const manufacturerMap = new Map();
  
//     for (const item of combinedMap.values()) {
//       const manufacturerEmail = item.productBy;
//       if (!manufacturerMap.has(manufacturerEmail)) {
//         manufacturerMap.set(manufacturerEmail, []);
//       }
//       manufacturerMap.get(manufacturerEmail).push(item);
//     }
  
//     const resultArray = [];
  
//     for (const [manufacturerEmail, set] of manufacturerMap.entries()) {
//       resultArray.push({ manufacturerEmail, set });
//     }
  
//     return resultArray; // Final format as array
//   };

const combinePendingRetailerPOItems = async (wholesalerEmail) => {
    const allRetailerPOs = await PORetailerToWholesaler.find({
      wholesalerEmail,
      statusAll: 'pending',
      'set.status': 'pending',
    });
  
    const combinedMap = new Map();
  
    // Step 1: Combine all set items
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
  
    // Step 2: Group by manufacturerEmail
    const manufacturerMap = new Map();
    for (const item of combinedMap.values()) {
      const manufacturerEmail = item.productBy;
      if (!manufacturerMap.has(manufacturerEmail)) {
        manufacturerMap.set(manufacturerEmail, []);
      }
      manufacturerMap.get(manufacturerEmail).push(item);
    }
  
    // Step 3: Fetch wholesaler details once
    const wholesaler = await Wholesaler.findOne({ email: wholesalerEmail }).select(
      'email fullName companyName address state country pinCode mobNumber profileImg GSTIN pan logo discountGiven'
    );
    if (!wholesaler) throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  
    const createdPoIds = [];
  
    // Step 4: For each manufacturer, prepare and store PO
    for (const [manufacturerEmail, set] of manufacturerMap.entries()) {
      const manufacturer = await Manufacture.findOne({ email: manufacturerEmail }).select(
        'fullName companyName email address country state city profileImg pinCode logo mobNumber GSTIN pan'
      );
      if (!manufacturer) throw new ApiError(httpStatus.NOT_FOUND, `Manufacturer not found: ${manufacturerEmail}`);
  
      // Fetch discount info from wholesaler.discountGiven array
      let productDiscount = null;
      let category = null;
      
      const discountEntry = wholesaler.discountGiven?.find(
        (entry) => entry.discountGivenBy === manufacturerEmail
      );
      
      if (discountEntry) {
        productDiscount = discountEntry.productDiscount ?? null;
        category = discountEntry.category ?? null;
      }
      // Get latest PO number
      const lastPo = await POWholesalerToManufacturer.findOne({ wholesalerEmail }).sort({ poNumber: -1 }).lean();
      const poNumber = lastPo ? lastPo.poNumber + 1 : 1;
  
      // Extract unique retailer PO IDs
      const createdFromRetailerPoIds = [
        ...new Set(set.flatMap((s) => s.retailerPoLinks.map((link) => link.poId)))
      ];
  
      // Create PO document
      const newPO = new POWholesalerToManufacturer({
        wholesalerEmail,
        manufacturerEmail,
        poNumber,
        createdFromRetailerPoIds,
        set: set.map(s => ({
          designNumber: s.designNumber,
          colour: s.colour,
          colourName: s.colourName,
          size: s.size,
          totalQuantity: s.totalQuantity,
          clothing: s.clothing,
          gender: s.gender,
          subCategory: s.subCategory,
          productType: s.productType,
          manufacturerPrice: s.manufacturerPrice,
          price: s.price,
          availableQuantity: 0,
          status: 'pending',
          retailerPoLinks: s.retailerPoLinks
        })),
        wholesaler: {
          email: wholesaler.email,
          fullName: wholesaler.fullName,
          companyName: wholesaler.companyName,
          address: wholesaler.address,
          state: wholesaler.state,
          country: wholesaler.country,
          pinCode: wholesaler.pinCode,
          mobNumber: wholesaler.mobNumber,
          GSTIN: wholesaler.GSTIN,
          profileImg: wholesaler.profileImg,
          logo: wholesaler.logo,
          productDiscount,
          category
        },
        manufacturer: {
          email: manufacturer.email,
          fullName: manufacturer.fullName,
          companyName: manufacturer.companyName,
          address: manufacturer.address,
          state: manufacturer.state,
          country: manufacturer.country,
          pinCode: manufacturer.pinCode,
          mobNumber: manufacturer.mobNumber,
          GSTIN: manufacturer.GSTIN,
          profileImg: manufacturer.profileImg,
          logo: manufacturer.logo,
        },
        statusAll: 'pending'
      });
  
      await newPO.save();
      createdPoIds.push(newPO._id);
  
      // Step 5: Update status for referenced retailer PO sets
      for (const s of set) {
        for (const link of s.retailerPoLinks) {
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
  
      // Step 6: Update overall status of retailer POs
      for (const poId of createdFromRetailerPoIds) {
        await PORetailerToWholesaler.updateOne(
          { _id: poId },
          { $set: { statusAll: 'processing' } }
        );
      }
    }
  
    return {
      message: 'POs to manufacturers created successfully',
      createdPoIds
    };
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
