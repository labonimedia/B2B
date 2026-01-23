const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufactureWarehouse } = require('../../models');

const generateNextWarehouseCode = async () => {
  const lastWarehouse = await ManufactureWarehouse.findOne({ code: /^WH\d+$/ })
    .sort({ code: -1 }) 
    .lean();

  if (!lastWarehouse || !lastWarehouse.code) {
    return 'WH1';
  }

  const lastNumber = parseInt(lastWarehouse.code.replace('WH', ''), 10) || 0;
  const nextNumber = lastNumber + 1;

  return `WH${nextNumber}`;
};

const createWarehouse = async (warehouseBody) => {
  const { manufacturerEmail, warehouseName } = warehouseBody;

  if (!manufacturerEmail || !warehouseName) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail and warehouseName are required');
  }
  const existing = await ManufactureWarehouse.findOne({ manufacturerEmail, warehouseName });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Warehouse with this name already exists for this manufacturer');
  }

  if (!warehouseBody.code) {
    warehouseBody.code = await generateNextWarehouseCode();
  }

  const warehouse = await ManufactureWarehouse.create(warehouseBody);
  return warehouse;
};

const queryWarehouses = async (filter, options) => {
  const warehouses = await ManufactureWarehouse.paginate(filter, options);
  return warehouses;
};

const getWarehouseById = async (id) => {
  return ManufactureWarehouse.findById(id);
};

const updateWarehouseById = async (warehouseId, updateBody) => {
  const warehouse = await getWarehouseById(warehouseId);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  if (updateBody.code) {
    delete updateBody.code;
  }

  Object.assign(warehouse, updateBody);
  await warehouse.save();
  return warehouse;
};

const deleteWarehouseById = async (warehouseId) => {
  const warehouse = await getWarehouseById(warehouseId);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  warehouse.isActive = false;
  await warehouse.save();
  return warehouse;
};

const deleteWarehousePerment = async (warehouseId) => {
  const warehouse = await getWarehouseById(warehouseId);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }
  await warehouse.remove();
  return warehouse;
};

module.exports = {
  createWarehouse,
  queryWarehouses,
  getWarehouseById,
  updateWarehouseById,
  deleteWarehouseById,
  deleteWarehousePerment,
};
