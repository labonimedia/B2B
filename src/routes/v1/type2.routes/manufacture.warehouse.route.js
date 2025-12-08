const express = require('express');
const { manufactureWarehouseController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(manufactureWarehouseController.createWarehouse)
  .get(manufactureWarehouseController.queryWarehouses);

router
  .route('/:id')
  .get(manufactureWarehouseController.getWarehouseById)
  .patch(manufactureWarehouseController.updateWarehouseById)
  .delete(manufactureWarehouseController.deleteWarehouseById);

module.exports = router;
