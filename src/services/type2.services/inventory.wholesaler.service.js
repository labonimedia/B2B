const httpStatus = require('http-status');
const { WholesalerInventory } = require('../../models');
const ApiError = require('../../utils/ApiError');

const findByDesignNumbers = async (designNumbers) => {
  return WholesalerInventory.find({
    designNumber: { $in: designNumbers },
  }).sort({ designNumber: 1, colour: 1 });
};

// const bulkInsertInventory = async (inventoryArray) => {
//   if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'Request body must be a non-empty array'
//     );
//   }

//   const bulkOps = inventoryArray.map((item) => ({
//     updateOne: {
//       filter: {
//         userEmail: item.userEmail,
//         designNumber: item.designNumber,
//         brandName: item.brandName,
//         colour: item.colour,
//         brandSize: item.brandSize,
//         standardSize: item.standardSize,
//       },
//       update: {
//         $set: {
//           quantity: item.quantity,
//           minimumQuantityAlert: item.minimumQuantityAlert,
//           colourName: item.colourName,
//           lastUpdatedBy: item.lastUpdatedBy || '',
//           lastUpdatedAt: new Date(),
//         },
//       },
//       upsert: true,
//     },
//   }));

//   const result = await WholesalerInventory.bulkWrite(bulkOps);

//   const updatedDocs = await WholesalerInventory.find({
//     designNumber: { $in: inventoryArray.map((i) => i.designNumber) },
//   });

//   return { status: result, updatedData: updatedDocs };
// };
const bulkInsertInventory = async (inventoryArray) => {
  if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Request body must be a non-empty array'
    );
  }

  const bulkOps = inventoryArray.map((item) => ({
    updateOne: {
      filter: {
        userEmail: item.userEmail,
        designNumber: item.designNumber,
        brandName: item.brandName,
        colour: item.colour,
        brandSize: item.brandSize,
        standardSize: item.standardSize,
      },
      update: {
        $set: {
          quantity: item.quantity,
          minimumQuantityAlert: item.minimumQuantityAlert,
          colourName: item.colourName,
          lastUpdatedBy: item.lastUpdatedBy || '',
          lastUpdatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  const result = await WholesalerInventory.bulkWrite(bulkOps);

  // ✅ Fetch ONLY exact updated records
  const orConditions = inventoryArray.map((item) => ({
    userEmail: item.userEmail,
    designNumber: item.designNumber,
    brandName: item.brandName,
    colour: item.colour,
    brandSize: item.brandSize,
    standardSize: item.standardSize,
  }));

  const updatedDocs = await WholesalerInventory.find({
    $or: orConditions,
  });

  return { status: result, updatedData: updatedDocs };
};

const createInventory = async (data) => {
  return WholesalerInventory.create(data);
};

const bulkUpdateInventory = async (updates) => {
  const results = [];

  for (const update of updates) {
    const {
      _id,
      quantity,
      status,
      lastUpdatedBy,
      designNumber,
      colourName,
      standardSize,
      userEmail,
    } = update;

    let inventory = _id
      ? await WholesalerInventory.findById(_id)
      : await WholesalerInventory.findOne({
          designNumber,
          colourName,
          standardSize,
          userEmail,
        });

    if (!inventory) {
      throw new Error('Inventory record not found');
    }

    if (status === 'add') inventory.quantity += quantity;
    else if (status === 'remove')
      inventory.quantity = Math.max(0, inventory.quantity - quantity);
    else throw new Error('Invalid inventory update status');

    inventory.lastUpdatedBy = lastUpdatedBy || 'system';
    inventory.lastUpdatedAt = new Date();

    await inventory.save();
    results.push(inventory);
  }

  return results;
};

const queryInventories = async (filter, options, search) => {
  const matchStage = { ...filter };

  if (search) {
    matchStage.$or = [
      { designNumber: { $regex: search, $options: 'i' } },
      { brandName: { $regex: search, $options: 'i' } },
    ];
  }

  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const aggregation = await WholesalerInventory.aggregate([
    { $match: matchStage },
    {
      $addFields: {
        isLowStock: { $lte: ['$quantity', '$minimumQuantityAlert'] },
      },
    },
    {
      $group: {
        _id: '$designNumber',
        totalQuantity: { $sum: '$quantity' },
        hasLowStock: { $max: { $cond: ['$isLowStock', 1, 0] } },
        entries: { $push: '$$ROOT' },
      },
    },
    { $sort: { hasLowStock: -1, _id: 1 } },
    {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  return {
    results: aggregation[0].paginatedResults,
    page,
    limit,
    totalResults: aggregation[0].totalCount[0]?.count || 0,
    totalPages: Math.ceil(
      (aggregation[0].totalCount[0]?.count || 0) / limit
    ),
  };
};

const getInventoryById = async (id) => WholesalerInventory.findById(id);

const updateInventoryById = async (id, updateData) => {
  const inventory = await getInventoryById(id);
  if (!inventory) throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');

  Object.assign(inventory, updateData);
  inventory.lastUpdatedAt = new Date();
  await inventory.save();

  return inventory;
};

const deleteInventoryById = async (id) => {
  const inventory = await getInventoryById(id);
  if (!inventory) throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  await inventory.deleteOne();
};

module.exports = {
  createInventory,
  bulkInsertInventory,
  bulkUpdateInventory,
  queryInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
  findByDesignNumbers,
};
