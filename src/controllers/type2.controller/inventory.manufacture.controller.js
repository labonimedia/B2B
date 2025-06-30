const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { ManufactureInventoryService } = require('../../services');
const pick = require('../../utils/pick');

const bulkCreateInventories = catchAsync(async (req, res) => {
  const inventories = await ManufactureInventoryService.bulkInsertInventory(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: inventories });
});

const createInventory = catchAsync(async (req, res) => {
  const result = await ManufactureInventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userEmail', 'designNumber', 'colour', 'size', 'colourName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ManufactureInventoryService.queryInventories(filter, options);
  res.send(result);
});

const getInventoryById = catchAsync(async (req, res) => {
  const inventory = await ManufactureInventoryService.getInventoryById(req.params.id);
  if (!inventory) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Inventory not found' });
    return;
  }
  res.send(inventory);
});

const updateInventory = catchAsync(async (req, res) => {
  const updated = await ManufactureInventoryService.updateInventoryById(req.params.id, req.body);
  res.send(updated);
});

const deleteInventory = catchAsync(async (req, res) => {
  await ManufactureInventoryService.deleteInventoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventory,
  bulkCreateInventories,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
