
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
/**
 * Get items by category + subcategory + optional itemName search
 */
// const getItemsByCategorySubcategory = async (body) => {
//   const { categoryId, subcategoryId, itemName, categoryName, subcategoryName } = body;

//   const filter = {};

//   if (categoryId) filter.categoryId = categoryId;
//   if (subcategoryId) filter.subcategoryId = subcategoryId;

//   if (categoryName) filter.categoryName = new RegExp(categoryName, 'i');
//   if (subcategoryName) filter.subcategoryName = new RegExp(subcategoryName, 'i');

//   if (itemName) filter.itemName = { $regex: itemName, $options: "i" };

//   const items = await ManufactureMasterItem.find(filter).lean();

//   return items;
// };
const getItemsByCategorySubcategory = async (filter, options) => {
  const query = {};

  if (filter.categoryId) query.categoryId = filter.categoryId;
  if (filter.subcategoryId) query.subcategoryId = filter.subcategoryId;

  if (filter.categoryName)
    query.categoryName = { $regex: filter.categoryName, $options: "i" };

  if (filter.subcategoryName)
    query.subcategoryName = { $regex: filter.subcategoryName, $options: "i" };

  if (filter.itemName)
    query.itemName = { $regex: filter.itemName, $options: "i" };

  // Default pagination options
  options.limit = options.limit || 10;
  options.page = options.page || 1;
  options.sortBy = options.sortBy || "createdAt:desc";

  const result = await ManufactureMasterItem.paginate(query, options);

  return result;
};
module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
  getItemsByCategorySubcategory,
};
