const httpStatus = require('http-status');
const { WholesalerInventoryLogs } = require('../../models');
const ApiError = require('../../utils/ApiError');

const bulkInsertInventory = async (logsArray) => {
  if (!Array.isArray(logsArray) || logsArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const bulkOps = logsArray.map((item) => ({
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
        $push: {
          recordsArray: {
            updatedQuantity: item.updatedQuantity,
            previousRemainingQuantity: item.previousRemainingQuantity,
            status: item.status,
            lastUpdatedBy: item.lastUpdatedBy,
            reason: item.reason,
            lastUpdatedAt: new Date(),
          },
        },
      },
      upsert: true,
    },
  }));

  const result = await WholesalerInventoryLogs.bulkWrite(bulkOps);

  const updatedDocs = await WholesalerInventoryLogs.find({
    designNumber: { $in: logsArray.map((i) => i.designNumber) },
  });

  return { status: result, updatedData: updatedDocs };
};

const createInventory = async (data) => {
  return WholesalerInventoryLogs.create(data);
};

// const queryInventories = async (filter, options, search) => {
//   const matchStage = { ...filter };

//   if (search) {
//     matchStage.$or = [{ designNumber: { $regex: search, $options: 'i' } }, { brandName: { $regex: search, $options: 'i' } }];
//   }

//   return WholesalerInventoryLogs.paginate(matchStage, options);
// };
const queryInventories = async (filter = {}, options = {}, search = '') => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const matchStage = { ...filter };

  if (search) {
    matchStage.$or = [
      { designNumber: { $regex: search, $options: 'i' } },
      { brandName: { $regex: search, $options: 'i' } },
    ];
  }

  const aggregation = await WholesalerInventoryLogs.aggregate([
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
            $cond: [
              { $eq: ['$recordsArray.status', 'stock_added'] },
              '$recordsArray.updatedQuantity',
              0,
            ],
          },
        },

        totalQuantityRemoved: {
          $sum: {
            $cond: [
              { $eq: ['$recordsArray.status', 'stock_removed'] },
              '$recordsArray.updatedQuantity',
              0,
            ],
          },
        },

        latestUpdatedAt: { $max: '$recordsArray.lastUpdatedAt' },

        entries: {
          $push: {
            _id: '$_id',
            userEmail: '$userEmail',
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
  return WholesalerInventoryLogs.findById(id);
};

const updateInventoryById = async (id, updateData) => {
  const inventory = await getInventoryById(id);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory log not found');
  }

  Object.assign(inventory, updateData);
  await inventory.save();
  return inventory;
};

const deleteInventoryById = async (id) => {
  const inventory = await getInventoryById(id);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory log not found');
  }

  await inventory.deleteOne();
};

module.exports = {
  createInventory,
  bulkInsertInventory,
  queryInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
};
