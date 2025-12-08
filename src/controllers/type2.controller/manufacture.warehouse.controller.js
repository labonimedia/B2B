const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { manufactureWarehouseService } = require('../../services');

// Create warehouse
const createWarehouse = catchAsync(async (req, res) => {
  const warehouse = await manufactureWarehouseService.createWarehouse(req.body);
  res.status(httpStatus.CREATED).send(warehouse);
});

// List / query warehouses
const queryWarehouses = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'manufacturerEmail',
    'warehouseName',
    'isActive',
    'city',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manufactureWarehouseService.queryWarehouses(filter, options);
  res.send(result);
});

// Get warehouse by id
const getWarehouseById = catchAsync(async (req, res) => {
  const warehouse = await manufactureWarehouseService.getWarehouseById(req.params.id);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }
  res.send(warehouse);
});

// Update warehouse by id
const updateWarehouseById = catchAsync(async (req, res) => {
  const warehouse = await manufactureWarehouseService.updateWarehouseById(req.params.id, req.body);
  res.send(warehouse);
});

// Delete warehouse by id
const deleteWarehouseById = catchAsync(async (req, res) => {
  await manufactureWarehouseService.deleteWarehouseById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWarehouse,
  queryWarehouses,
  getWarehouseById,
  updateWarehouseById,
  deleteWarehouseById,
};
