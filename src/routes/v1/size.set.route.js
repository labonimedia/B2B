const express = require('express');
const auth = require('../../middlewares/auth');
const { sizeSetController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.createSizeSet)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.querySizeSet);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.getSizeSetById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.updateSizeSetById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), sizeSetController.deleteSizeSetById);

module.exports = router;
