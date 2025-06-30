const httpStatus = require('http-status');
const { RetailerInventory } = require('../../models');
const ApiError = require('../../utils/ApiError');

const createInventory = async (data) => {
  return RetailerInventory.create(data);
};

const queryInventories = async (filter, options) => {
  return RetailerInventory.paginate(filter, options);
};

const getInventoryById = async (id) => {
  return RetailerInventory.findById(id);
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
};
