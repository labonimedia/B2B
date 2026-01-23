const httpStatus = require('http-status');
const { ManufactureInventoryLogs } = require('../../models');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');

const bulkInsertInventory = async (inventoryArray) => {
  if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }
  const bulkOps = inventoryArray.map((item) => {
    const filter = {
      userEmail: item.userEmail,
      designNumber: item.designNumber,
      brandName: item.brandName,
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
  const updatedDesignNumbers = inventoryArray.map((item) => item.designNumber);
  const updatedDocs = await ManufactureInventoryLogs.find({
    designNumber: { $in: updatedDesignNumbers },
  });

  return {
    status: result,
    updatedData: updatedDocs,
  };
};

const createInventory = async (dataArray) => {
  const results = [];

  for (const data of dataArray) {
    const { userEmail, productId, designNumber, colour, brandName, colourName, brandSize, standardSize, recordsArray } =
      data;

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

const queryInventories = async (filter = {}, options = {}, search = '') => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const matchStage = { ...filter };
  if (search) {
    matchStage.$or = [{ designNumber: { $regex: search, $options: 'i' } }, { brandName: { $regex: search, $options: 'i' } }];
  }
  const aggregation = await ManufactureInventoryLogs.aggregate([
    { $match: matchStage },

    { $unwind: '$recordsArray' },

    {
      $group: {
        _id: {
          designNumber: '$designNumber',
          brandName: '$brandName',
        },
        totalUpdates: { $sum: 1 },
        totalQuantityAdded: {
          $sum: {
            $cond: [{ $eq: ['$recordsArray.status', 'stock_added'] }, '$recordsArray.updatedQuantity', 0],
          },
        },
        totalQuantityRemoved: {
          $sum: {
            $cond: [{ $eq: ['$recordsArray.status', 'stock_removed'] }, '$recordsArray.updatedQuantity', 0],
          },
        },
        latestUpdatedAt: { $max: '$recordsArray.lastUpdatedAt' },
        entries: {
          $push: {
            _id: '$_id',
            userEmail: '$userEmail',
            productId: '$productId',
            colour: '$colour',
            colourName: '$colourName',
            brandSize: '$brandSize',
            standardSize: '$standardSize',
            records: '$recordsArray',
          },
        },
      },
    },

    {
      $addFields: {
        designNumber: '$_id.designNumber',
        brandName: '$_id.brandName',
      },
    },

    { $project: { _id: 0 } },

    { $sort: { latestUpdatedAt: -1 } },

    {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
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
