const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { WholesalerInventoryService } = require('../../services');
const pick = require('../../utils/pick');

const createInventory = catchAsync(async (req, res) => {
  const result = await WholesalerInventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userEmail', 'designNumber', 'colour', 'size', 'colourName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await WholesalerInventoryService.queryInventories(filter, options);
  res.send(result);
});

const getInventoryById = catchAsync(async (req, res) => {
  const inventory = await WholesalerInventoryService.getInventoryById(req.params.id);
  if (!inventory) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Inventory not found' });
    return;
  }
  res.send(inventory);
});

const updateInventory = catchAsync(async (req, res) => {
  const updated = await WholesalerInventoryService.updateInventoryById(req.params.id, req.body);
  res.send(updated);
});

const deleteInventory = catchAsync(async (req, res) => {
  await WholesalerInventoryService.deleteInventoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
