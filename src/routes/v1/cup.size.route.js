const express = require('express');
const auth = require('../../middlewares/auth');
const { cupSizeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cupSizeController.createCupSize)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cupSizeController.queryCupSize);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cupSizeController.getCupSizeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cupSizeController.updateCupSizeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), cupSizeController.deleteCupSizeById);

module.exports = router;
