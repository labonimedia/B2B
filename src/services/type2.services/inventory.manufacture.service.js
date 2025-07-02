const httpStatus = require('http-status');
const { ManufactureInventory } = require('../../models');
const ApiError = require('../../utils/ApiError');

// const bulkInsertInventory = async (inventoryArray) => {
//   if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
//   }

//   return ManufactureInventory.insertMany(inventoryArray);
// };
const bulkInsertInventory = async (inventoryArray) => {
  if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const bulkOps = inventoryArray.map((item) => {
    const filter = {
      userEmail: item.userEmail,
      designNumber: item.designNumber,
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
      },
    };

    return {
      updateOne: {
        filter,
        update,
        upsert: true, // ← this creates if not found
      },
    };
  });

  // Perform all operations in bulk
  const result = await ManufactureInventory.bulkWrite(bulkOps);

  return result;
};
const createInventory = async (data) => {
  return ManufactureInventory.create(data);
};

// const queryInventories = async (filter, options) => {
//   return ManufactureInventory.paginate(filter, options);
// };

const queryInventories = async (filter, options, search) => {
  const matchStage = { ...filter };

  if (search) {
    matchStage.designNumber = { $regex: search, $options: 'i' };
  }

  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const aggregation = await ManufactureInventory.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$designNumber',
        totalQuantity: { $sum: '$quantity' },
        entries: {
          $push: {
            _id: '$_id',
            userEmail: '$userEmail',
            designNumber: '$designNumber',
            colour: '$colour',
            colourName: '$colourName',
            brandSize: '$brandSize',
            standardSize: '$standardSize',
            quantity: '$quantity',
            minimumQuantityAlert: '$minimumQuantityAlert',
            lastUpdatedAt: '$lastUpdatedAt',
             productId: '$productId',
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $facet: {
        paginatedResults: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: 'count' },
        ],
      },
    },
  ])
    .allowDiskUse(true); // Optional, safe for large datasets

  const results = aggregation[0]?.paginatedResults || [];
  const totalCount = aggregation[0]?.totalCount[0]?.count || 0;

  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalResults: totalCount,
  };
};


const getInventoryById = async (id) => {
  return ManufactureInventory.findById(id);
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
