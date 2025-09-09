const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { ManufactureInventoryService } = require('../../services');
const pick = require('../../utils/pick');

const getInventoriesByDesignNumbers = catchAsync(async (req, res) => {
  const { designNumbers } = req.body;

  if (!Array.isArray(designNumbers) || designNumbers.length === 0) {
    return res.status(400).json({ message: 'designNumbers must be a non-empty array' });
  }

  const result = await ManufactureInventoryService.findByDesignNumbers(designNumbers);
  res.status(200).json({ success: true, data: result });
});
// const bulkCreateInventories = catchAsync(async (req, res) => {
//   const inventories = await ManufactureInventoryService.bulkInsertInventory(req.body);
//   res.status(httpStatus.CREATED).send({ success: true, data: inventories });
// });
const bulkCreateInventories = catchAsync(async (req, res) => {
  const { status, updatedData } = await ManufactureInventoryService.bulkInsertInventory(req.body);
  res.status(httpStatus.CREATED).send({ success: true, status, data: updatedData });
});
const createInventory = catchAsync(async (req, res) => {
  const result = await ManufactureInventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const bulkUpdateInventory = catchAsync(async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: 'Updates array is required' });
  }

  const result = await ManufactureInventoryService.bulkUpdateInventory(updates);
  res.status(200).json({
    message: 'Inventory updated successfully',
    data: result,
  });
});

// const getInventories = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['userEmail', 'designNumber', 'colour', 'size', 'colourName']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await ManufactureInventoryService.queryInventories(filter, options);
//   res.send(result);
// });
// const getInventories = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['userEmail', 'designNumber', 'colour', 'brandSize', 'standardSize', 'colourName', 'productId']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const search = req.query.search || ''; // optional designNumber search

//   const result = await ManufactureInventoryService.queryInventories(filter, options, search);
//   res.send(result);
// });

// const getInventories = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['userEmail','brandName' , 'designNumber', 'colour', 'brandSize', 'standardSize', 'colourName', 'productId']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const search = req.query.search || '';

//   // Convert productId to ObjectId
//   if (filter.productId) {
//     const mongoose = require('mongoose');
//     try {
//       filter.productId = new mongoose.Types.ObjectId(filter.productId);
//     } catch (error) {
//       return res.status(400).send({ message: 'Invalid productId' });
//     }
//   }

//   const result = await ManufactureInventoryService.queryInventories(filter, options, search);
//   res.send(result);
// });

const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'userEmail',
    'brandName',
    'designNumber',
    'colour',
    'brandSize',
    'standardSize',
    'colourName',
    'productId',
  ]);
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

  const result = await ManufactureInventoryService.queryInventories(filter, options, search);
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
  getInventoriesByDesignNumbers,
  bulkUpdateInventory,
};
