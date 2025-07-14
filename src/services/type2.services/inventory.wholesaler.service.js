const httpStatus = require('http-status');
const { WholesalerInventory } = require('../../models');
const ApiError = require('../../utils/ApiError');

const createInventory = async (data) => {
  return WholesalerInventory.create(data);
};

const queryInventories = async (filter, options) => {
  return WholesalerInventory.paginate(filter, options);
};

const getInventoryById = async (id) => {
  return WholesalerInventory.findById(id);
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
      // productId: new mongoose.Types.ObjectId(item.productId),
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

  const result = await WholesalerInventory.bulkWrite(bulkOps);

  // Optionally fetch updated documents to return in response
  const updatedDesignNumbers = inventoryArray.map((item) => item.designNumber);

  const updatedDocs = await WholesalerInventory.find({
    designNumber: { $in: updatedDesignNumbers },
  });

  return {
    status: result,
    updatedData: updatedDocs,
  };
};

module.exports = {
  createInventory,
  queryInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
  bulkInsertInventory,
};
