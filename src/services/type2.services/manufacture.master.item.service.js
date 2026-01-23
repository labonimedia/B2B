const httpStatus = require('http-status');
const { ManufactureMasterItem } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { deleteFile } = require('../../utils/upload'); // <-- Import deleteFile

const createItem = async (reqBody) => {
  return ManufactureMasterItem.create(reqBody);
};

const queryItems = async (filter, options) => {
  return ManufactureMasterItem.paginate(filter, options);
};

const getItemById = async (id) => {
  return ManufactureMasterItem.findById(id).populate('subcategoryId');
};

const updateItemById = async (id, updateBody) => {
  const item = await getItemById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteItemById = async (id) => {
  const item = await getItemById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  try {
    if (item.photo1) {
      await deleteFile(item.photo1);
    }
    if (item.photo2) {
      await deleteFile(item.photo2);
    }
  } catch (err) {
    console.error('Error deleting item images:', err.message);
  }

  await item.deleteOne();
  return item;
};

const getItemsByCategorySubcategory = async (filter, options) => {
  const query = {};

  if (filter.categoryId) query.categoryId = filter.categoryId;
  if (filter.subcategoryId) query.subcategoryId = filter.subcategoryId;

  if (filter.categoryName) query.categoryName = { $regex: filter.categoryName, $options: 'i' };

  if (filter.subcategoryName) query.subcategoryName = { $regex: filter.subcategoryName, $options: 'i' };

  if (filter.itemName) query.itemName = { $regex: filter.itemName, $options: 'i' };

  options.limit = options.limit || 10;
  options.page = options.page || 1;
  options.sortBy = options.sortBy || 'createdAt:desc';

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
