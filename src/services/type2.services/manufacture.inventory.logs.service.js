const httpStatus = require('http-status');
const { ManufactureInventoryLogs } = require('../../models');
const ApiError = require('../../utils/ApiError');
 const mongoose = require('mongoose');
 
// const bulkInsertInventory = async (inventoryArray) => {
//   if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
//   }

//   return ManufactureInventoryLogs.insertMany(inventoryArray);
// };

// const bulkInsertInventory = async (inventoryArray) => {
//   if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
//   }

//   const bulkOps = inventoryArray.map((item) => {
//     const filter = {
//       userEmail: item.userEmail,
//       designNumber: item.designNumber,
//       colour: item.colour,
//       brandSize: item.brandSize,
//       standardSize: item.standardSize,
//       productId: new mongoose.Types.ObjectId(item.productId),
//     };

//     const update = {
//       $set: {
//         quantity: item.quantity,
//         minimumQuantityAlert: item.minimumQuantityAlert,
//         lastUpdatedBy: item.lastUpdatedBy || '',
//         lastUpdatedAt: new Date(),
//       },
//     };

//     return {
//       updateOne: {
//         filter,
//         update,
//         upsert: true, // ← this creates if not found
//       },
//     };
//   });

//   // Perform all operations in bulk
//   const result = await ManufactureInventoryLogs.bulkWrite(bulkOps);

//   return result;
// };

const bulkInsertInventory = async (inventoryArray) => {
  if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const bulkOps = inventoryArray.map((item) => {
    const filter = {
      userEmail: item.userEmail,
      designNumber: item.designNumber,
      brandName:item.brandName,
      colour: item.colour,
      brandSize: item.brandSize,
      standardSize: item.standardSize,
      productId: new mongoose.Types.ObjectId(item.productId),
    };

    const update = {
      $set: {
        quantity: item.quantity,
        minimumQuantityAlert: item.minimumQuantityAlert,
        lastUpdatedBy: item.lastUpdatedBy || '',
        lastUpdatedAt: new Date(),
        colourName: item.colourName, // <-- Make sure to include this
      },
    };

    return {
      updateOne: {
        filter,
        update,
        upsert: true,
      },
    };
  });

  const result = await ManufactureInventoryLogs.bulkWrite(bulkOps);

  // Optionally fetch updated documents to return in response
  const updatedDesignNumbers = inventoryArray.map((item) => item.designNumber);

  const updatedDocs = await ManufactureInventoryLogs.find({
    designNumber: { $in: updatedDesignNumbers },
  });

  return {
    status: result,
    updatedData: updatedDocs,
  };
};

// const createInventory = async (data) => {
//   return ManufactureInventoryLogs.create(data);
// };

// const createInventory = async (data) => {
//   const {
//     userEmail,
//     productId,
//     designNumber,
//     colour,
//     brandName,
//     colourName,
//     brandSize,
//     standardSize,
//     recordsArray
//   } = data;

//   const filter = {
//     userEmail,
//     productId,
//     designNumber,
//     colour,
//     brandName,
//     colourName,
//     brandSize,
//     standardSize,
//   };

//   // Check if a log already exists
//   let existingLog = await ManufactureInventoryLogs.findOne(filter);

//   if (existingLog) {
//     // Push new record to existing document
//     existingLog.recordsArray.push(...recordsArray); // push one or multiple records
//     await existingLog.save();
//     return existingLog;
//   } else {
//     // Create a new log document
//     const newLog = await ManufactureInventoryLogs.create({
//       ...filter,
//       recordsArray,
//     });
//     return newLog;
//   }
// };

const createInventory = async (dataArray) => {
  const results = [];

  for (const data of dataArray) {
    const {
      userEmail,
      productId,
      designNumber,
      colour,
      brandName,
      colourName,
      brandSize,
      standardSize,
      recordsArray
    } = data;

    const filter = {
      userEmail,
      productId,
      designNumber,
      colour,
      brandName,
      colourName,
      brandSize,
      standardSize,
    };

    let existingLog = await ManufactureInventoryLogs.findOne(filter);

    if (existingLog) {
      existingLog.recordsArray.push(...recordsArray);
      await existingLog.save();
      results.push(existingLog);
    } else {
      const newLog = await ManufactureInventoryLogs.create({
        ...filter,
        recordsArray,
      });
      results.push(newLog);
    }
  }

  return results;
};

// const queryInventories = async (filter, options) => {
//   return ManufactureInventoryLogs.paginate(filter, options);
// };

// const queryInventories = async (filter = {}, options = {}) => {
//   const page = parseInt(options.page) || 1;
//   const limit = parseInt(options.limit) || 10;
//   const skip = (page - 1) * limit;

//   const aggregation = await ManufactureInventoryLogs.aggregate([
//     { $match: filter },

//     // Flatten recordsArray
//     { $unwind: "$recordsArray" },

//     // Group by designNumber
//     {
//       $group: {
//         _id: "$designNumber",
//         totalUpdates: { $sum: 1 },
//         totalQuantityAdded: {
//           $sum: {
//             $cond: [{ $eq: ["$recordsArray.status", "stock_added"] }, "$recordsArray.updatedQuantity", 0],
//           },
//         },
//         totalQuantityRemoved: {
//           $sum: {
//             $cond: [{ $eq: ["$recordsArray.status", "stock_removed"] }, "$recordsArray.updatedQuantity", 0],
//           },
//         },
//          brandName: "$brandName",
//         latestUpdatedAt: { $max: "$recordsArray.lastUpdatedAt" },
//         entries: {
//           $push: {
//             _id: "$_id",
//             userEmail: "$userEmail",
//             productId: "$productId",
//             colour: "$colour",
//             colourName: "$colourName",
//             brandSize: "$brandSize",
//             standardSize: "$standardSize",
//             brandName: "$brandName",
//             records: "$recordsArray",
//           }
//         },
//       },
//     },

//     // Sort by latestUpdatedAt descending
//     { $sort: { latestUpdatedAt: -1 } },

//     // Pagination
//     {
//       $facet: {
//         paginatedResults: [
//           { $skip: skip },
//           { $limit: limit },
//         ],
//         totalCount: [{ $count: 'count' }],
//       },
//     },
//   ]);

//   const results = aggregation[0]?.paginatedResults || [];
//   const totalCount = aggregation[0]?.totalCount?.[0]?.count || 0;

//   return {
//     results,
//     page,
//     limit,
//     totalPages: Math.ceil(totalCount / limit),
//     totalResults: totalCount,
//   };
// };

const queryInventories = async (filter = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const aggregation = await ManufactureInventoryLogs.aggregate([
    { $match: filter },

    // Flatten recordsArray
    { $unwind: "$recordsArray" },

    // Group by designNumber and brandName
    {
      $group: {
        _id: {
          designNumber: "$designNumber",
          brandName: "$brandName"
        },
        totalUpdates: { $sum: 1 },
        totalQuantityAdded: {
          $sum: {
            $cond: [{ $eq: ["$recordsArray.status", "stock_added"] }, "$recordsArray.updatedQuantity", 0],
          },
        },
        totalQuantityRemoved: {
          $sum: {
            $cond: [{ $eq: ["$recordsArray.status", "stock_removed"] }, "$recordsArray.updatedQuantity", 0],
          },
        },
        latestUpdatedAt: { $max: "$recordsArray.lastUpdatedAt" },
        entries: {
          $push: {
            _id: "$_id",
            userEmail: "$userEmail",
            productId: "$productId",
            colour: "$colour",
            colourName: "$colourName",
            brandSize: "$brandSize",
            standardSize: "$standardSize",
            records: "$recordsArray",
          }
        },
      },
    },

    // Add flat fields for _id values
    {
      $addFields: {
        designNumber: "$_id.designNumber",
        brandName: "$_id.brandName",
      },
    },

    // Remove _id object
    { $project: { _id: 0 } },

    // Sort
    { $sort: { latestUpdatedAt: -1 } },

    // Pagination
    {
      $facet: {
        paginatedResults: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const results = aggregation[0]?.paginatedResults || [];
  const totalCount = aggregation[0]?.totalCount?.[0]?.count || 0;

  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalResults: totalCount,
  };
};

// const queryInventories = async (filter, options, search) => {
//   const matchStage = { ...filter };

//   if (search) {
//     matchStage.designNumber = { $regex: search, $options: 'i' };
//   }

//   const page = parseInt(options.page, 10) || 1;
//   const limit = parseInt(options.limit, 10) || 10;
//   const skip = (page - 1) * limit;

//   const aggregation = await ManufactureInventoryLogs.aggregate([
//     { $match: matchStage },

//     // Flag if quantity is less than or equal to minimum alert
//     {
//       $addFields: {
//         isLowStock: { $lte: ['$quantity', '$minimumQuantityAlert'] },
//       },
//     },

//     // Group by designNumber and check if any entry isLowStock
//     {
//       $group: {
//         _id: '$designNumber',
//         totalQuantity: { $sum: '$quantity' },
//         hasLowStock: { $max: { $cond: ['$isLowStock', 1, 0] } },
//         entries: {
//           $push: {
//             _id: '$_id',
//             userEmail: '$userEmail',
//             designNumber: '$designNumber',
//             colour: '$colour',
//             colourName: '$colourName',
//             brandSize: '$brandSize',
//             standardSize: '$standardSize',
//             quantity: '$quantity',
//             minimumQuantityAlert: '$minimumQuantityAlert',
//             lastUpdatedAt: '$lastUpdatedAt',
//             productId: '$productId',
//             isLowStock: '$isLowStock',
//             brandName: '$brandName',
//           },
//         },
//       },
//     },

//     // Sort: first groups where any item is low or below alert
//     { $sort: { hasLowStock: -1, _id: 1 } },

//     // Pagination
//     {
//       $facet: {
//         paginatedResults: [
//           { $skip: skip },
//           { $limit: limit },
//         ],
//         totalCount: [{ $count: 'count' }],
//       },
//     },
//   ]).allowDiskUse(true);

//   const results = aggregation[0]?.paginatedResults || [];
//   const totalCount = aggregation[0]?.totalCount[0]?.count || 0;

//   return {
//     results,
//     page,
//     limit,
//     totalPages: Math.ceil(totalCount / limit),
//     totalResults: totalCount,
//   };
// };

// const queryInventories = async (filter, options, search) => {
//   const matchStage = { ...filter };

//   if (search) {
//     matchStage.designNumber = { $regex: search, $options: 'i' };
//   }

//   const page = parseInt(options.page, 10) || 1;
//   const limit = parseInt(options.limit, 10) || 10;
//   const skip = (page - 1) * limit;

//   const aggregation = await ManufactureInventoryLogs.aggregate([
//     { $match: matchStage },

//     // Project the last record entry and compute quantity
//     {
//       $addFields: {
//         lastRecord: { $arrayElemAt: ['$recordsArray', -1] }, // latest record
//       },
//     },
//     {
//       $addFields: {
//         quantity: {
//           $subtract: [
//             '$lastRecord.previousRemainingQuantity',
//             {
//               $cond: [
//                 { $eq: ['$lastRecord.status', 'stock_removed'] },
//                 '$lastRecord.updatedQuantity',
//                 0,
//               ],
//             },
//           ],
//         },
//       },
//     },

//     // Check if low stock
//     {
//       $addFields: {
//         isLowStock: {
//           $lte: ['$quantity', '$minimumQuantityAlert'],
//         },
//       },
//     },

//     // Group by designNumber for summary
//     {
//       $group: {
//         _id: '$designNumber',
//         totalQuantity: { $sum: '$quantity' },
//         hasLowStock: { $max: { $cond: ['$isLowStock', 1, 0] } },
//         entries: {
//           $push: {
//             _id: '$_id',
//             userEmail: '$userEmail',
//             productId: '$productId',
//             designNumber: '$designNumber',
//             colour: '$colour',
//             colourName: '$colourName',
//             brandSize: '$brandSize',
//             standardSize: '$standardSize',
//             brandName: '$brandName',
//             quantity: '$quantity',
//             lastUpdatedAt: '$lastRecord.lastUpdatedAt',
//             status: '$lastRecord.status',
//             isLowStock: '$isLowStock',
//           },
//         },
//       },
//     },

//     // Sort by low stock priority
//     { $sort: { hasLowStock: -1, _id: 1 } },

//     // Pagination
//     {
//       $facet: {
//         paginatedResults: [
//           { $skip: skip },
//           { $limit: limit },
//         ],
//         totalCount: [{ $count: 'count' }],
//       },
//     },
//   ]).allowDiskUse(true);

//   const results = aggregation[0]?.paginatedResults || [];
//   const totalCount = aggregation[0]?.totalCount[0]?.count || 0;

//   return {
//     results,
//     page,
//     limit,
//     totalPages: Math.ceil(totalCount / limit),
//     totalResults: totalCount,
//   };
// };

const getInventoryById = async (id) => {
  return ManufactureInventoryLogs.findById(id);
};

const updateInventoryById = async (id, updateData) => {
  const inventory = await getInventoryById(id);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }

  Object.assign(inventory, updateData);
  inventory.lastUpdatedAt = new Date();
  await inventory.save();
  return inventory;
};

const deleteInventoryById = async (id) => {
  const inventory = await getInventoryById(id);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  await inventory.deleteOne();
};

module.exports = {
  createInventory,
  queryInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
  bulkInsertInventory,
};
