const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const { wholesalerInventoryLogsController } = require('../../../controllers');

router
  .route('/bulk')
  .post(
    auth('superadmin', 'manufacture', 'wholesaler', 'retailer'),
    wholesalerInventoryLogsController.bulkCreateInventories
  );

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerInventoryLogsController.createInventory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerInventoryLogsController.getInventories);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerInventoryLogsController.getInventoryById)
  .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerInventoryLogsController.updateInventory)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), wholesalerInventoryLogsController.deleteInventory);

module.exports = router;
