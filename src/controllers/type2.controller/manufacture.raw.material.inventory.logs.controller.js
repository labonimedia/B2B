const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { manufactureRawMaterialInventoryLogsService } = require('../../services');

const createInventory = catchAsync(async (req, res) => {
  const inventory = await manufactureRawMaterialInventoryLogsService.createInventory(req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    data: inventory,
  });
});

const updateStock = catchAsync(async (req, res) => {
  const inventory = await manufactureRawMaterialInventoryLogsService.updateStock(req.body);
  res.status(httpStatus.OK).send({
    success: true,
    data: inventory,
  });
});

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
  const customFilters = pick(req.query, ['minStock', 'maxStock', 'lowStockOnly', 'vendorName', 'warehouseName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manufactureRawMaterialInventoryLogsService.queryInventories(filter, customFilters, options);
  res.send({
    success: true,
    data: result,
  });
});

const getInventoryById = catchAsync(async (req, res) => {
  const inventory = await manufactureRawMaterialInventoryLogsService.getInventoryById(req.params.id);
  if (!inventory) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Raw material inventory not found' });
  }
  res.send({
    success: true,
    data: inventory,
  });
});

const getLowStockMaterials = catchAsync(async (req, res) => {
  const data = await manufactureRawMaterialInventoryLogsService.getLowStockMaterials(req.query.manufacturerEmail);
  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

const deleteInventoryById = catchAsync(async (req, res) => {
  await manufactureRawMaterialInventoryLogsService.deleteInventoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCapacity = catchAsync(async (req, res) => {
  const result = await manufactureRawMaterialInventoryLogsService.getProductionCapacity(req.body);
  res.status(httpStatus.OK).send({
    success: true,
    data: result,
  });
});

module.exports = {
  createInventory,
  updateStock,
  getInventories,
  getInventoryById,
  getLowStockMaterials,
  deleteInventoryById,
  getCapacity,
};
