const express = require('express');

const router = express.Router();
const { RetailerInventoryController } = require('../../../controllers');
const auth = require('../../../middlewares/auth');

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), RetailerInventoryController.createInventory)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), RetailerInventoryController.getInventories);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), RetailerInventoryController.getInventoryById)
  .put(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), RetailerInventoryController.updateInventory)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), RetailerInventoryController.deleteInventory);

module.exports = router;
