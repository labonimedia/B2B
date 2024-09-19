const express = require('express');
const auth = require('../../middlewares/auth');
const { weaveTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveTypeController.createWeaveType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveTypeController.queryWeaveType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveTypeController.getWeaveTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveTypeController.updateWeaveTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), weaveTypeController.deleteWeaveTypeById);

module.exports = router;
