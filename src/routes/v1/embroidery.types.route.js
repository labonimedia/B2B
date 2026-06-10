const express = require('express');
const auth = require('../../middlewares/auth');
const { embroideryTypesController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embroideryTypesController.create)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embroideryTypesController.query);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embroideryTypesController.getById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embroideryTypesController.updateById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer'), embroideryTypesController.deleteById);

module.exports = router;
