const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufactureRawMaterialInventory, ManufactureMasterItem } = require('../../models');

const createInventory = async (payload) => {
  const { masterItemId, manufacturerEmail } = payload;

  // 1. Check existing inventory
  const exists = await ManufactureRawMaterialInventory.findOne({ masterItemId });
  if (exists) {
    throw new Error('Inventory already exists for this item');
  }

  // 2. Fetch master item
  const masterItem = await ManufactureMasterItem.findById(masterItemId);
  if (!masterItem) {
    throw new Error('Master item not found');
  }
  // 3. Create inventory with required fields
  return ManufactureRawMaterialInventory.create({
    masterItemId,
    manufacturerEmail,
    // copied from master item
    itemName: masterItem.itemName,
    code: masterItem.code,
    categoryId: masterItem.categoryId,
    categoryName: masterItem.categoryName,
    subcategoryId: masterItem.subcategoryId,
    subcategoryName: masterItem.subcategoryName,
    stockUnit: masterItem.stockUnit,
  });
};

/**
 * Update stock with logs
 */
const updateStock = async (payload) => {
  const { masterItemId, quantity, changeType, reason, updatedBy } = payload;

  const inventory = await ManufactureRawMaterialInventory.findOne({
    masterItemId,
  });

  if (!inventory) throw new Error('Inventory not found');

  const previousStock = inventory.currentStock;
  let updatedStock = previousStock;

  if (changeType === 'stock_added') {
    updatedStock += quantity;
  } else if (changeType === 'stock_removed') {
    if (previousStock < quantity) {
      throw new Error('Insufficient stock');
    }
    updatedStock -= quantity;
  } else if (changeType === 'adjustment') {
    updatedStock = quantity;
  }

  inventory.currentStock = updatedStock;

  inventory.inventoryLogs.push({
    previousStock,
    updatedStock,
    changeType,
    reason,
    updatedBy,
  });

  await inventory.save();
  return inventory;
};

/**
 * Query inventories (advanced filtering)
 */
const queryInventories = async (filter, customFilters, options) => {
  const query = { ...filter };

  // Stock range filter
  if (customFilters.minStock || customFilters.maxStock) {
    query.currentStock = {};
    if (customFilters.minStock) query.currentStock.$gte = Number(customFilters.minStock);
    if (customFilters.maxStock) query.currentStock.$lte = Number(customFilters.maxStock);
  }

  // Low stock only
  if (customFilters.lowStockOnly === 'true') {
    query.$expr = {
      $lte: ['$currentStock', '$minimumStockLevel'],
    };
  }

  // Vendor filter
  if (customFilters.vendorName) {
    query['vendorDetails.vendorName'] = {
      $regex: customFilters.vendorName,
      $options: 'i',
    };
  }

  // Warehouse filter
  if (customFilters.warehouseName) {
    query['warehouseDetails.warehouseName'] = {
      $regex: customFilters.warehouseName,
      $options: 'i',
    };
  }

  return ManufactureRawMaterialInventory.paginate(query, options);
};

/**
 * Get inventory by ID
 */
const getInventoryById = async (id) => {
  return ManufactureRawMaterialInventory.findById(id);
};

/**
 * Low stock materials
 */
const getLowStockMaterials = async (manufacturerEmail) => {
  return ManufactureRawMaterialInventory.find({
    manufacturerEmail,
    $expr: { $lte: ['$currentStock', '$minimumStockLevel'] },
  });
};

/**
 * Delete inventory
 */
const deleteInventoryById = async (id) => {
  return ManufactureRawMaterialInventory.findByIdAndDelete(id);
};

module.exports = {
  createInventory,
  updateStock,
  queryInventories,
  getInventoryById,
  getLowStockMaterials,
  deleteInventoryById,
};
