const express = require('express');
const auth = require('../../middlewares/auth');
const { collarStyleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), collarStyleController.createCollarStyle)
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), collarStyleController.queryCollarStyle);

router
  .route('/:id')
  .get(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), collarStyleController.getCollarStyleById)
  .patch(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), collarStyleController.updateCollarStyleById)
  .delete(auth('superadmin', 'manufacture', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer', 'wholesaler', 'retailer'), collarStyleController.deleteCollarStyleById);

module.exports = router;
