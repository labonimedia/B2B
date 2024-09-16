const express = require('express');
const auth = require('../../middlewares/auth');
const { returnOrderController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnOrderController.createReturnOrder)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnOrderController.queryReturnOrder);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnOrderController.getReturnOrderById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnOrderController.updateReturnOrderById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), returnOrderController.deleteReturnOrderById);

module.exports = router;
