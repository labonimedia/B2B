const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { WholesalerInventoryService } = require('../../services');
const pick = require('../../utils/pick');

// const getInventoriesByDesignNumbers = catchAsync(async (req, res) => {
//   const { designNumbers } = req.body;

//   if (!Array.isArray(designNumbers) || designNumbers.length === 0) {
//     return res.status(httpStatus.BAD_REQUEST).json({ message: 'designNumbers must be a non-empty array' });
//   }

//   const result = await WholesalerInventoryService.findByDesignNumbers(designNumbers);
//   res.status(httpStatus.OK).json({ success: true, data: result });
// });
const getInventoriesByDesignNumbers = catchAsync(async (req, res) => {
  let { designNumbers, wholesalerEmail, brandName } = req.body;

  // 🔥 Normalize designNumbers
  if (typeof designNumbers === 'string') {
    designNumbers = [designNumbers];
  }

  if (!Array.isArray(designNumbers) || designNumbers.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'designNumbers must be a string or non-empty array',
    });
  }

  if (!wholesalerEmail) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'wholesalerEmail is required',
    });
  }

  const result = await WholesalerInventoryService.findByDesignNumbers({
    designNumbers,
    wholesalerEmail,
    brandName,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const bulkCreateInventories = catchAsync(async (req, res) => {
  const { status, updatedData } = await WholesalerInventoryService.bulkInsertInventory(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    status,
    data: updatedData,
  });
});

const createInventory = catchAsync(async (req, res) => {
  const result = await WholesalerInventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const bulkUpdateInventory = catchAsync(async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Updates array is required' });
  }

  const result = await WholesalerInventoryService.bulkUpdateInventory(updates);
  res.status(httpStatus.OK).json({
    message: 'Inventory updated successfully',
    data: result,
  });
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

  const result = await WholesalerInventoryService.queryInventories(filter, options, search);

  res.send(result);
});

const getInventoryById = catchAsync(async (req, res) => {
  const inventory = await WholesalerInventoryService.getInventoryById(req.params.id);

  if (!inventory) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Inventory not found' });
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
  bulkCreateInventories,
  bulkUpdateInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getInventoriesByDesignNumbers,
};
