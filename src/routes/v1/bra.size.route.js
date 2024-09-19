const express = require('express');
const auth = require('../../middlewares/auth');
const { braSizeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braSizeController.createBraSize)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braSizeController.queryBraSize);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braSizeController.getBraSizeById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braSizeController.updateBraSizeById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), braSizeController.deleteBraSizeById);

module.exports = router;
