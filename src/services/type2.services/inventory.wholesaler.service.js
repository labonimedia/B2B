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

module.exports = {
  createInventory,
  queryInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
};
