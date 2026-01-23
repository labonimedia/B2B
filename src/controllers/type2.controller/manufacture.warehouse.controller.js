const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { manufactureWarehouseService } = require('../../services');

const createWarehouse = catchAsync(async (req, res) => {
  const warehouse = await manufactureWarehouseService.createWarehouse(req.body);
  res.status(httpStatus.CREATED).send(warehouse);
});

const queryWarehouses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'warehouseName', 'code', 'isActive', 'city']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manufactureWarehouseService.queryWarehouses(filter, options);
  res.send(result);
});

const getWarehouseById = catchAsync(async (req, res) => {
  const warehouse = await manufactureWarehouseService.getWarehouseById(req.params.id);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }
  res.send(warehouse);
});

const updateWarehouseById = catchAsync(async (req, res) => {
  const warehouse = await manufactureWarehouseService.updateWarehouseById(req.params.id, req.body);
  res.send(warehouse);
});

const deleteWarehouseById = catchAsync(async (req, res) => {
  await manufactureWarehouseService.deleteWarehouseById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteWarehousePerment = catchAsync(async (req, res) => {
  await manufactureWarehouseService.deleteWarehousePerment(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWarehouse,
  queryWarehouses,
  getWarehouseById,
  updateWarehouseById,
  deleteWarehouseById,
  deleteWarehousePerment,
};
