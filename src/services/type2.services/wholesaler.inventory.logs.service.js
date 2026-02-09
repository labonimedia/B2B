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

const queryInventories = async (filter, options, search) => {
  const matchStage = { ...filter };

  if (search) {
    matchStage.$or = [{ designNumber: { $regex: search, $options: 'i' } }, { brandName: { $regex: search, $options: 'i' } }];
  }

  return WholesalerInventoryLogs.paginate(matchStage, options);
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
