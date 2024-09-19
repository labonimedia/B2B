const express = require('express');
const auth = require('../../middlewares/auth');
const { backStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), backStyleController.createBackStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), backStyleController.queryBackStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), backStyleController.getBackStyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), backStyleController.updateBackStyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), backStyleController.deleteBackStyleById);

module.exports = router;
