const express = require('express');
const auth = require('../../middlewares/auth');
const { waistTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistTypeController.createWaistType)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistTypeController.queryWaistType);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistTypeController.getWaistTypeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistTypeController.updateWaistTypeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistTypeController.deleteWaistTypeById);

module.exports = router;
