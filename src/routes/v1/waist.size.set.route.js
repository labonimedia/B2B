const express = require('express');
const auth = require('../../middlewares/auth');
const { waistSizeSetController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistSizeSetController.createWaistSizeSet)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistSizeSetController.queryWaistSizeSet);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistSizeSetController.getWaistSizeSetById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistSizeSetController.updateWaistSizeSetById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), waistSizeSetController.deleteWaistSizeSetById);

module.exports = router;
