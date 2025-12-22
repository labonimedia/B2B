
// const httpStatus = require('http-status');
// const { ManufactureMasterItem } = require('../../models');
// const ApiError = require('../../utils/ApiError');

// /**
//  * Create Item
//  */
// const createItem = async (reqBody) => {
//   return ManufactureMasterItem.create(reqBody);
// };

// /**
//  * Query Items (with pagination)
//  */
// const queryItems = async (filter, options) => {
//   const items = await ManufactureMasterItem.paginate(filter, options);
//   return items;
// };

// /**
//  * Get Item by ID
//  */
// const getItemById = async (id) => {
//   return ManufactureMasterItem.findById(id).populate("subcategoryId");
// };

// /**
//  * Update Item by ID
//  */
// const updateItemById = async (id, updateBody) => {
//   const item = await getItemById(id);
//   if (!item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
//   }

//   Object.assign(item, updateBody);
//   await item.save();
//   return item;
// };

// /**
//  * Delete Item by ID
//  */
// const deleteItemById = async (id) => {
//   const item = await getItemById(id);
//   if (!item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
//   }

//   await item.remove();
//   return item;
// };

// module.exports = {
//   createItem,
//   queryItems,
//   getItemById,
//   updateItemById,
//   deleteItemById,
// };

const httpStatus = require('http-status');
const { ManufactureMasterItem } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { deleteFile } = require('../../utils/upload'); // <-- Import deleteFile

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
  return ManufactureMasterItem.paginate(filter, options);
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
 * Delete Item by ID + delete cloud images
 */
const deleteItemById = async (id) => {
  const item = await getItemById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  // ⭐ Delete photo1 & photo2 from DigitalOcean Spaces
  try {
    if (item.photo1) {
      await deleteFile(item.photo1);
    }
    if (item.photo2) {
      await deleteFile(item.photo2);
    }
  } catch (err) {
    console.error("Error deleting item images:", err.message);
    // Do NOT throw — still continue deleting DB
  }

  await item.deleteOne();
  return item;
};

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
