const express = require('express');
const auth = require('../../middlewares/auth');
const { finishTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finishTypeController.createFinishType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finishTypeController.queryFinishType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finishTypeController.getFinishTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finishTypeController.updateFinishTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), finishTypeController.deleteFinishTypeById);

module.exports = router;
