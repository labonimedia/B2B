const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { wholesalerInventoryLogsService } = require('../../services');
const pick = require('../../utils/pick');

const bulkCreateInventories = catchAsync(async (req, res) => {
  const { status, updatedData } = await wholesalerInventoryLogsService.bulkInsertInventory(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    status,
    data: updatedData,
  });
});

const createInventory = catchAsync(async (req, res) => {
  const result = await wholesalerInventoryLogsService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'userEmail',
    'brandName',
    'designNumber',
    'colour',
    'brandSize',
    'standardSize',
    'colourName',
  ]);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = req.query.search || '';

  const result = await wholesalerInventoryLogsService.queryInventories(filter, options, search);

  res.send(result);
});

const getInventoryById = catchAsync(async (req, res) => {
  const inventory = await wholesalerInventoryLogsService.getInventoryById(req.params.id);

  if (!inventory) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Inventory log not found' });
  }

  res.send(inventory);
});

const updateInventory = catchAsync(async (req, res) => {
  const updated = await wholesalerInventoryLogsService.updateInventoryById(req.params.id, req.body);
  res.send(updated);
});

const deleteInventory = catchAsync(async (req, res) => {
  await wholesalerInventoryLogsService.deleteInventoryById(req.params.id);
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
