const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const { ManufactureInventoryLogsController } = require('../../../controllers');

router
  .route('/bulk')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    ManufactureInventoryLogsController.bulkCreateInventories
  );

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryLogsController.createInventory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryLogsController.getInventories);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryLogsController.getInventoryById)
  .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryLogsController.updateInventory)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), ManufactureInventoryLogsController.deleteInventory);

module.exports = router;
