const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const {
  manufactureRawMaterialInventoryLogsService,
} = require('../../services');

/**
 * Create Raw Material Inventory
 */
const createInventory = catchAsync(async (req, res) => {
  const inventory =
    await manufactureRawMaterialInventoryLogsService.createInventory(
      req.body.masterItemId
    );

  res.status(httpStatus.CREATED).send({
    success: true,
    data: inventory,
  });
});

/**
 * Update Raw Material Stock (Add / Remove / Adjustment)
 */
const updateStock = catchAsync(async (req, res) => {
  const inventory =
    await manufactureRawMaterialInventoryLogsService.updateStock(req.body);

  res.status(httpStatus.OK).send({
    success: true,
    data: inventory,
  });
});

// /**
//  * Get Raw Material Inventory List (with filters + pagination)
//  */
// const getInventories = catchAsync(async (req, res) => {
//   const filter = pick(req.query, [
//     'manufacturerEmail',
//     'categoryId',
//     'subcategoryId',
//     'itemName',
//     'isActive',
//   ]);

//   const options = pick(req.query, ['sortBy', 'limit', 'page']);

//   const result =
//     await manufactureRawMaterialInventoryLogsService.queryInventories(
//       filter,
//       options
//     );

//   res.send({
//     success: true,
//     data: result,
//   });
// });
/**
 * Get Raw Material Inventory List (with advanced filters + pagination)
 */
const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'manufacturerEmail',
    'categoryId',
    'categoryName',
    'subcategoryId',
     'masterItemId',
    'subcategoryName',
    'itemName',
    'code',
    'stockUnit',
    'isActive',
  ]);

  // Custom range & flags
  const customFilters = pick(req.query, [
    'minStock',
    'maxStock',
    'lowStockOnly',
    'vendorName',
    'warehouseName',
  ]);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result =
    await manufactureRawMaterialInventoryLogsService.queryInventories(
      filter,
      customFilters,
      options
    );

  res.send({
    success: true,
    data: result,
  });
});

/**
 * Get Inventory By ID
 */
const getInventoryById = catchAsync(async (req, res) => {
  const inventory =
    await manufactureRawMaterialInventoryLogsService.getInventoryById(
      req.params.id
    );

  if (!inventory) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: 'Raw material inventory not found' });
  }

  res.send({
    success: true,
    data: inventory,
  });
});

/**
 * Get Low Stock Raw Materials
 */
const getLowStockMaterials = catchAsync(async (req, res) => {
  const data =
    await manufactureRawMaterialInventoryLogsService.getLowStockMaterials(
      req.query.manufacturerEmail
    );

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * Delete Inventory (Soft / Hard – based on service)
 */
const deleteInventoryById = catchAsync(async (req, res) => {
  await manufactureRawMaterialInventoryLogsService.deleteInventoryById(
    req.params.id
  );

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventory,
  updateStock,
  getInventories,
  getInventoryById,
  getLowStockMaterials,
  deleteInventoryById,
};
