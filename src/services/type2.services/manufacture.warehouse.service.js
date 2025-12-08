const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { ManufacturerWarehouse } = require('../../models'); // 👈 make sure this matches models/index.js

// 🔹 Helper: Generate next incremental warehouse code: "WH1", "WH2", ...
const generateNextWarehouseCode = async () => {
  const lastWarehouse = await ManufacturerWarehouse.findOne({ code: /^WH\d+$/ })
    .sort({ code: -1 }) // highest code string-wise, e.g. WH10 > WH9
    .lean();

  if (!lastWarehouse || !lastWarehouse.code) {
    return 'WH1';
  }

  const lastNumber = parseInt(lastWarehouse.code.replace('WH', ''), 10) || 0;
  const nextNumber = lastNumber + 1;

  return `WH${nextNumber}`;
};

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

  // Check duplicate name per manufacturer
  const existing = await ManufacturerWarehouse.findOne({ manufacturerEmail, warehouseName });
  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Warehouse with this name already exists for this manufacturer'
    );
  }

  // Auto-generate code if not provided
  if (!warehouseBody.code) {
    warehouseBody.code = await generateNextWarehouseCode();
  }

  const warehouse = await ManufacturerWarehouse.create(warehouseBody);
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
  const warehouses = await ManufacturerWarehouse.paginate(filter, options);
  return warehouses;
};

/**
 * Get warehouse by id
 */
const getWarehouseById = async (id) => {
  return ManufacturerWarehouse.findById(id);
};

/**
 * Update warehouse by id
 */
const updateWarehouseById = async (warehouseId, updateBody) => {
  const warehouse = await getWarehouseById(warehouseId);
  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  // Optional: do not allow manual code change
  if (updateBody.code) {
    delete updateBody.code;
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
