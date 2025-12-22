
const httpStatus = require('http-status');
//  const mongoose = require('mongoose');
const { ManufactureMasterItem } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create Item
 */
const createItem = async (reqBody) => {
  return ManufactureMasterItem.create(reqBody);
};

/**
 * Query Items (with pagination)
 */
const queryItems = async (filter, options) => {
  const items = await ManufactureMasterItem.paginate(filter, options);
  return items;
};

/**
 * Get Item by ID
 */
const getItemById = async (id) => {
  return ManufactureMasterItem.findById(id).populate("subcategoryId");
};

/**
 * Update Item by ID
 */
const updateItemById = async (id, updateBody) => {
  const item = await getItemById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  Object.assign(item, updateBody);
  await item.save();
  return item;
};

/**
 * Delete Item by ID
 */
const deleteItemById = async (id) => {
  const item = await getItemById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await item.remove();
  return item;
};

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
