const httpStatus = require('http-status');
const { ManufactureInventory } = require('../../models');
const ApiError = require('../../utils/ApiError');

const bulkInsertInventory = async (inventoryArray) => {
  if (!Array.isArray(inventoryArray) || inventoryArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  return ManufactureInventory.insertMany(inventoryArray);
};

const createInventory = async (data) => {
  return ManufactureInventory.create(data);
};

const queryInventories = async (filter, options) => {
  return ManufactureInventory.paginate(filter, options);
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
