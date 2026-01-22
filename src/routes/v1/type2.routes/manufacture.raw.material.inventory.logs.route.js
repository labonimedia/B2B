const express = require('express');
const auth = require('../../../middlewares/auth');
const router = express.Router();

const { manufactureRawMaterialInventoryLogsController } = require('../../../controllers');

// CREATE INVENTORY
// FILTER INVENTORY
router.post(
  '/filter',
  auth('superadmin', 'manufacture', 'wholesaler'),
  manufactureRawMaterialInventoryLogsController.getInventories
);

// LOW STOCK MATERIALS
router.get(
  '/low-stock/list',
  auth('superadmin', 'manufacture', 'wholesaler'),
  manufactureRawMaterialInventoryLogsController.getLowStockMaterials
);
router.post(
  '/production-capacity',
  auth('superadmin', 'manufacture', 'wholesaler'),
  manufactureRawMaterialInventoryLogsController.getCapacity
);


router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler'), manufactureRawMaterialInventoryLogsController.createInventory)
  .get(auth('superadmin', 'manufacture', 'wholesaler'), manufactureRawMaterialInventoryLogsController.getInventories);

// GET / UPDATE / DELETE INVENTORY BY ID
router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler'), manufactureRawMaterialInventoryLogsController.getInventoryById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler'), manufactureRawMaterialInventoryLogsController.updateStock)
  .delete(
    auth('superadmin', 'manufacture', 'wholesaler'),
    manufactureRawMaterialInventoryLogsController.deleteInventoryById
  );


module.exports = router;
