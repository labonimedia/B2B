const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufactureRawMaterialInventory, ManufactureMasterItem, ManufactureBOM } = require('../../models');

const createInventory = async (payload) => {
  const { masterItemId, manufacturerEmail, data } = payload;

  if (!masterItemId || !manufacturerEmail) {
    throw new Error('masterItemId and manufacturerEmail are required');
  }

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

  // 3. Create inventory (MERGED DATA)
  return ManufactureRawMaterialInventory.create({
    masterItemId,
    manufacturerEmail,

    // copied from master item
    itemName: masterItem.itemName,
    code: masterItem.code,
    categoryId: masterItem.categoryId,
    categoryName: masterItem.categoryName,
    categoryCode: masterItem.categoryCode,
    subcategoryId: masterItem.subcategoryId,
    subcategoryName: masterItem.subcategoryName,
    subcategoryCode: masterItem.subcategoryCode,
    stockUnit: masterItem.stockUnit,

    // from payload.data
    vendorDetails: data.vendorDetails,
    warehouseDetails: data.warehouseDetails,
    rackRowMappings: data.rackRowMappings,
    details: data.details,
    note: data.note,
    photo1: data.photo1,
    isActive: data.isActive ?? true,

    // inventory specific
    currentStock: data.stockInHand || 0,
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

const queryInventories = async (filter, customFilters, options) => {
  const query = { ...filter };

  if (customFilters.minStock || customFilters.maxStock) {
    query.currentStock = {};
    if (customFilters.minStock) query.currentStock.$gte = Number(customFilters.minStock);
    if (customFilters.maxStock) query.currentStock.$lte = Number(customFilters.maxStock);
  }

  if (customFilters.lowStockOnly === 'true') {
    query.$expr = {
      $lte: ['$currentStock', '$minimumStockLevel'],
    };
  }

  if (customFilters.vendorName) {
    query['vendorDetails.vendorName'] = {
      $regex: customFilters.vendorName,
      $options: 'i',
    };
  }

  if (customFilters.warehouseName) {
    query['warehouseDetails.warehouseName'] = {
      $regex: customFilters.warehouseName,
      $options: 'i',
    };
  }

  return ManufactureRawMaterialInventory.paginate(query, options);
};

const getInventoryById = async (id) => {
  return ManufactureRawMaterialInventory.findById(id);
};

const getLowStockMaterials = async (manufacturerEmail) => {
  return ManufactureRawMaterialInventory.find({
    manufacturerEmail,
    $expr: { $lte: ['$currentStock', '$minimumStockLevel'] },
  });
};

const deleteInventoryById = async (id) => {
  return ManufactureRawMaterialInventory.findByIdAndDelete(id);
};

// const getProductionCapacity = async ({
//   manufacturerEmail,
//   designNumber,
//   color,
//   size,
// }) => {
//   const bom = await ManufactureBOM.findOne({
//     manufacturerEmail,
//     designNumber,
//   }).lean();

//   if (!bom) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'BOM not found');
//   }

//   const colorGroup = bom.colors.find((c) => c.color === color);
//   if (!colorGroup) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Color not found in BOM');
//   }

//   const sizeGroup = colorGroup.sizes.find((s) => s.size === size);
//   if (!sizeGroup) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Size not found in BOM');
//   }

//   const materialNames = sizeGroup.materials.map(
//     (m) => m.materialName
//   );

//   const inventories = await ManufactureRawMaterialInventory.find({
//     manufacturerEmail,
//     itemName: { $in: materialNames },
//   }).lean();

//   const inventoryMap = new Map();
//   inventories.forEach((inv) => {
//     inventoryMap.set(inv.itemName, inv);
//   });

//   const materialResults = sizeGroup.materials.map((material) => {
//     const inventory = inventoryMap.get(material.materialName);

//     if (!inventory) {
//       return {
//         materialName: material.materialName,
//         requiredQtyPerPiece: material.qtyPerPiece,
//         availableStock: 0,
//         possibleQuantity: 0,
//         status: 'NO_INVENTORY',
//       };
//     }

//     const possibleQty = Math.floor(
//       inventory.currentStock / material.qtyPerPiece
//     );

//     return {
//       materialName: material.materialName,
//       requiredQtyPerPiece: material.qtyPerPiece,
//       availableStock: inventory.currentStock,
//       possibleQuantity: possibleQty,
//       status: possibleQty > 0 ? 'OK' : 'INSUFFICIENT',
//     };
//   });

//   const producibleQuantity = Math.min(
//     ...materialResults.map((m) => m.possibleQuantity)
//   );

//   return {
//     designNumber,
//     color,
//     size,
//     producibleQuantity,
//     materials: materialResults,
//   };
// };

const getProductionCapacity = async ({
  manufacturerEmail,
  designNumber,
  color,
  size,
}) => {

  const bom = await ManufactureBOM.findOne({
    manufacturerEmail,
    designNumber,
  }).lean();

  if (!bom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BOM not found');
  }

  const colorGroup = bom.colors.find((c) => c.color === color);
  if (!colorGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Color not found in BOM');
  }

  const sizeGroup = colorGroup.sizes.find((s) => s.size === size);
  if (!sizeGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Size not found in BOM');
  }

  const materialNames = sizeGroup.materials.map(
    (m) => m.materialName
  );

  const inventories = await ManufactureRawMaterialInventory.find({
    manufacturerEmail,
    itemName: { $in: materialNames },
  }).lean();

  const inventoryMap = new Map();
  inventories.forEach((inv) => {
    inventoryMap.set(inv.itemName, inv);
  });

  const materialResults = sizeGroup.materials.map((material) => {
    const inventory = inventoryMap.get(material.materialName);

    if (!inventory) {
      return {
        materialName: material.materialName,
        itemCode: material.materialCode || null,
        requiredQtyPerPiece: material.qtyPerPiece,
        availableStock: 0,
        possibleQuantity: 0,
        vendorDetails: null,
        warehouseDetails: null,
        status: 'NO_INVENTORY',
      };
    }

    const possibleQty = Math.floor(
      inventory.currentStock / material.qtyPerPiece
    );

    return {
      materialName: material.materialName,
      itemCode: inventory.code || null,
      requiredQtyPerPiece: material.qtyPerPiece,
      availableStock: inventory.currentStock,
      possibleQuantity: possibleQty,
      vendorDetails: inventory.vendorDetails || null,
      warehouseDetails: inventory.warehouseDetails || null,
      status: possibleQty > 0 ? 'OK' : 'INSUFFICIENT',
    };
  });

  const producibleQuantity =
    materialResults.length > 0
      ? Math.min(...materialResults.map((m) => m.possibleQuantity))
      : 0;

  return {
    designNumber,
    color,
    size,
    producibleQuantity,
    materials: materialResults,
  };
};

module.exports = {
  createInventory,
  updateStock,
  queryInventories,
  getInventoryById,
  getLowStockMaterials,
  deleteInventoryById,
  getProductionCapacity,
};
