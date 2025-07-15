const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { ManufactureInventoryLogsService } = require('../../services');
const pick = require('../../utils/pick');

// const bulkCreateInventories = catchAsync(async (req, res) => {
//   const inventories = await ManufactureInventoryService.bulkInsertInventory(req.body);
//   res.status(httpStatus.CREATED).send({ success: true, data: inventories });
// });

const bulkCreateInventories = catchAsync(async (req, res) => {
  const { status, updatedData } = await ManufactureInventoryLogsService.bulkInsertInventory(req.body);
  res.status(httpStatus.CREATED).send({ success: true, status, data: updatedData });
});

const createInventory = catchAsync(async (req, res) => {
  const result = await ManufactureInventoryLogsService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

// const getInventories = catchAsync(async (req, res) => {
//  const filter = pick(req.query, ['userEmail','brandName' , 'designNumber', 'colour', 'brandSize', 'standardSize', 'colourName', 'productId']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
// //   const search = req.query.search || '';
// //   // Convert productId to ObjectId
//   if (filter.productId) {
//     const mongoose = require('mongoose');
//     try {
//       filter.productId = new mongoose.Types.ObjectId(filter.productId);
//     } catch (error) {
//       return res.status(400).send({ message: 'Invalid productId' });
//     }
//   }
//   const result = await ManufactureInventoryLogsService.queryInventories(filter, options);
//   res.send(result);
// });



const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userEmail','brandName' , 'designNumber', 'colour', 'brandSize', 'standardSize', 'colourName', 'productId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = req.query.search || '';

  // Convert productId to ObjectId
  if (filter.productId) {
    const mongoose = require('mongoose');
    try {
      filter.productId = new mongoose.Types.ObjectId(filter.productId);
    } catch (error) {
      return res.status(400).send({ message: 'Invalid productId' });
    }
  }

  const result = await ManufactureInventoryLogsService.queryInventories(filter, options, search);
  res.send(result);
});

const getInventoryById = catchAsync(async (req, res) => {
  const inventory = await ManufactureInventoryLogsService.getInventoryById(req.params.id);
  if (!inventory) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Inventory not found' });
    return;
  }
  res.send(inventory);
});

const updateInventory = catchAsync(async (req, res) => {
  const updated = await ManufactureInventoryLogsService.updateInventoryById(req.params.id, req.body);
  res.send(updated);
});

const deleteInventory = catchAsync(async (req, res) => {
  await ManufactureInventoryLogsService.deleteInventoryById(req.params.id);
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
