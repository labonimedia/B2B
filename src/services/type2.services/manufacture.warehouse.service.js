const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufactureWarehouse } = require('../../models'); 



/**
 * Create a warehouse for a manufacturer
 */
const createWarehouse = async (warehouseBody) => {
  const { manufacturerEmail, warehouseName } = warehouseBody;

  if (!manufacturerEmail || !warehouseName) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'manufacturerEmail and warehouseName are required'
    );
  }

  const existing = await ManufactureWarehouse.findOne({ manufacturerEmail, code });
  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Warehouse with this name already exists for this manufacturer'
    );
  }

  const warehouse = await ManufactureWarehouse.create(warehouseBody);
  return warehouse;
};

/**
 * Query warehouses with pagination
 * filter: { manufacturerEmail, warehouseName, city, isActive }
 */
const queryWarehouses = async (filter, options) => {
  if (filter.isActive === undefined) {
    filter.isActive = true;
  }
  const warehouses = await ManufactureWarehouse.paginate(filter, options);
  return warehouses;
};

/**
 * Get warehouse by id
 */
const getWarehouseById = async (id) => {
  return ManufactureWarehouse.findById(id);
};

/**
 * Update warehouse by id
 */
const updateWarehouseById = async (warehouseId, updateBody) => {
  const warehouse = await getWarehouseById(warehouseId);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  Object.assign(warehouse, updateBody);
  await warehouse.save();
  return warehouse;
};

/**
 * Delete warehouse by id (soft delete)
 */
const deleteWarehouseById = async (warehouseId) => {
  const warehouse = await getWarehouseById(warehouseId);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  warehouse.isActive = false;
  await warehouse.save();
  return warehouse;
};

module.exports = {
  createWarehouse,
  queryWarehouses,
  getWarehouseById,
  updateWarehouseById,
  deleteWarehouseById,
};
